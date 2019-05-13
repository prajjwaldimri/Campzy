import aws from "aws-sdk";
import sharp from "sharp";
import multerS3 from "multer-s3";
import multer from "multer";

aws.config.update({
  secretAccessKey: process.env.aws_secret_access_key,
  accessKeyId: process.env.aws_access_key_id,
  region: "us-east-1"
});

// Upload file to AWS
const aws3 = new aws.S3();
const imageStorage = multer
  .memoryStorage
  // {
  // destination(req, file, callback): void {
  //   callback(null, "");
  // }
  // }
  ();

const uploadCampImages = (req: any, res: any): void => {
  if (req.files.length !== 0) {
    let filesLength = 0;
    const filesArray: string[] = [];
    req.files.forEach(
      (file: Express.Multer.File): void => {
        const fileName = `${Date.now()}__${file.originalname}`;
        filesArray.push(fileName);
        aws3.putObject(
          {
            Bucket: "campzy-images",
            Key: `high-res/${fileName}`,
            Body: file.buffer,
            ACL: "public-read"
          },
          (): void => {
            sharp(file.buffer)
              .resize(300, null)
              .png({
                progressive: true,
                compressionLevel: 5
              })
              .toBuffer(
                (err, buffer): void => {
                  aws3.putObject(
                    {
                      Bucket: "campzy-images",
                      Key: `low-res/${fileName}`,
                      Body: buffer,
                      ACL: "public-read"
                    },
                    (): void => {
                      sharp(file.buffer)
                        .resize(40, 40)
                        .png({
                          progressive: true,
                          compressionLevel: 9
                        })
                        .toBuffer(
                          (err2, buffer2): void => {
                            aws3.putObject(
                              {
                                Bucket: "campzy-images",
                                Key: `thumbnails/${fileName}`,
                                Body: buffer2,
                                ACL: "public-read"
                              },
                              (err4): void => {
                                if (err4) {
                                  throw new Error(err4.message);
                                }
                                filesLength += 1;
                                if (filesLength === req.files.length) {
                                  res.json(filesArray);
                                }
                              }
                            );
                          }
                        );
                    }
                  );
                }
              );
          }
        );
      }
    );
  } else {
    throw new Error("Failed to Update");
  }
};

const uploadDocument = multer({
  storage: multerS3({
    s3: aws3,
    bucket: "campzy-documents",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(_, file, cb): void {
      cb(null, {
        fieldName: file.originalname
      });
    },
    key(req, file, cb): void {
      cb(null, `${Date.now()}__${file.originalname}`);
    }
  })
});

const uploadCampDocuments = (req: Express.Request, res: any): void => {
  if (!req.files) {
    throw new Error("Cannot update empty files");
  }
  if (req.files.length !== 0) {
    res.json(req.files);
  } else throw new Error("Failed to update");
};

const deleteDocuments = (req: any, res: any): boolean => {
  try {
    if (!req.body) {
      throw new Error("Cannot Delete Empty Body");
    }
    const documentDelete = req.body.documentName;
    aws3.deleteObject(
      {
        Bucket: "campzy-documents",
        Key: `${documentDelete}`
      },
      (err): void => {
        if (err) {
          throw new Error("Cannot Delete");
        }
        res.json(documentDelete);
      }
    );
  } catch (err) {
    return err;
  }
  return true;
};

const deleteImage = (req: any, res: any): boolean | Error => {
  try {
    if (!req.body) {
      return new Error("Cannot send Empty Key");
    }
    if (req.body) {
      let imageDelete = "";
      if (req.body.blogImage) {
        imageDelete = req.body.blogImage;
      }
      if (req.body.imageName) {
        imageDelete = req.body.imageName;
      }
      aws3.deleteObject(
        {
          Bucket: "campzy-images",
          Key: `high-res/${imageDelete}`
        },
        (): void => {
          aws3.deleteObject(
            {
              Bucket: "campzy-images",
              Key: `low-res/${imageDelete}`
            },
            (): void => {
              aws3.deleteObject(
                {
                  Bucket: "campzy-images",
                  Key: `thumbnails/${imageDelete}`
                },
                (err): aws.AWSError => {
                  if (err) {
                    return err;
                  }
                  return res.json(imageDelete);
                }
              );
            }
          );
        }
      );
    } else {
      return new Error("Cannot Delete");
    }
  } catch (err) {
    return err;
  }
  return true;
};

export {
  uploadCampImages,
  uploadCampDocuments,
  deleteImage,
  deleteDocuments,
  uploadDocument,
  imageStorage
};
