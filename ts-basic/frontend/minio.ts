import * as Minio from 'minio'

const endpoint = process.env.ENDPOINT;
const useSSL = process.env.USESSL === 'true';
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_ACCESS_KEY;

const minioClient = new Minio.Client({
  endPoint: endpoint,
  useSSL: useSSL,
  accessKey: accessKey,
  secretKey: secretKey,
});


//バケット内に存在するオブジェクト名の一覧を取得する
export const get_object_name = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const objectNames: string[] = [];
    const stream = minioClient.listObjectsV2('images', '', true, '');

    stream.on('data', (obj) => {
      if (obj.name !== undefined) {
        objectNames.push(obj.name);
      }
    });

    stream.on('end', () => {
      resolve(objectNames);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
};

//バケット内のオブジェクトにアクセスするためのURLを発行する
export const get_data_url = async (): Promise<string[]> => {
  var urls: string[] = [];
  try {
    // objectNamesを取得
    const objectNames = await get_object_name();
    console.log(objectNames);

    if (objectNames.length > 0) {
      await Promise.all(objectNames.map(async (objectName) => {
        const data_name = objectName;
        const presignedUrl = await new Promise<string>((resolve, reject) => {
          minioClient.presignedUrl(
            'GET',
            'images',
            `${data_name}`,
            1000,
            { prefix: 'data', 'max-keys': 500 },
            function (err, url) {
              if (err) {
                reject(err);
              } else {
                resolve(url as string);
              }
            },
          );
        });
        urls.push(presignedUrl);
      }));
      return urls;
    } else {
      throw new Error('No object names available.');
    }
  } catch (error) {
    throw error;
  }
};
