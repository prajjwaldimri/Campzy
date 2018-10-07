const aws = require('aws-sdk');
const sharp = require('sharp');

aws.config.update({
  secretAccessKey: process.env.aws_secret_access_key,
  accessKeyId: process.env.aws_access_key_id,
  region: 'us-east-1',
});

// Upload file to AWS
const aws3 = new aws.S3();

const uploadCampImages = (req, res) => {
  if (req.files.length !== 0) {
    let filesLength = 0;
    const filesArray = [];
    req.files.forEach((file) => {
      const fileName = `${Date.now()}__${file.originalname}`;
      filesLength += 1;
      filesArray.push(fileName);
      aws3.putObject(
        {
          Bucket: 'campzy-images',
          Key: `high-res/${fileName}`,
          Body: file.buffer,
          ACL: 'public-read',
        },
        () => {
          sharp(file.buffer)
            .resize(300, null)
            .png({ progressive: true, compressionLevel: 5 })
            .toBuffer((err, buffer) => {
              aws3.putObject(
                {
                  Bucket: 'campzy-images',
                  Key: `low-res/${fileName}`,
                  Body: buffer,
                  ACL: 'public-read',
                },
                () => {
                  sharp(file.buffer)
                    .resize(40, 40)
                    .png({ progressive: true, compressionLevel: 9 })
                    .toBuffer((err2, buffer2) => {
                      aws3.putObject(
                        {
                          Bucket: 'campzy-images',
                          Key: `thumbnails/${fileName}`,
                          Body: buffer2,
                          ACL: 'public-read',
                        },
                        (err3) => {
                          if (err3) {
                            throw new Error(err3);
                          }
                          if (filesLength === req.files.length) {
                            res.json(filesArray);
                          }
                        },
                      );
                    });
                },
              );
            });
        },
      );
    });
  } else {
    throw new Error('Failed to Update!');
  }
};

const uploadCampDocuments = (req, res) => {
  if (!req.files) {
    throw new Error('Cannot update empty files');
  }
  res.json(req.files);
};

const deleteDocuments = (req, res) => {
  try {
    if (!req.body) {
      throw new Error('Cannot Delete Empty Body');
    }
    const documentDelete = req.body.documentName;
    aws3.deleteObject(
      {
        Bucket: 'campzy-documents',
        Key: `${documentDelete}`,
      },
      (err) => {
        if (err) {
          throw new Error('Cannot Delete');
        }
        res.json(documentDelete);
      },
    );
  } catch (err) {
    return err;
  }
  return true;
};

const deleteImage = (req, res) => {
  try {
    if (!req.body) {
      return new Error('Cannot send Empty Key');
    }
    if (req.body) {
      let imageDelete = '';
      if (req.body.blogImage) {
        imageDelete = req.body.blogImage;
      }
      if (req.body.imageName) {
        imageDelete = req.body.imageName;
      }
      aws3.deleteObject(
        {
          Bucket: 'campzy-images',
          Key: `high-res/${imageDelete}`,
        },
        () => {
          aws3.deleteObject(
            {
              Bucket: 'campzy-images',
              Key: `low-res/${imageDelete}`,
            },
            () => {
              aws3.deleteObject(
                {
                  Bucket: 'campzy-images',
                  Key: `thumbnails/${imageDelete}`,
                },
                (err) => {
                  if (err) {
                    return err;
                  }
                  return res.json(imageDelete);
                },
              );
            },
          );
        },
      );
    } else {
      return new Error('Cannot Delete');
    }
  } catch (err) {
    return err;
  }
  return true;
};

module.exports = {
  uploadCampImages,
  uploadCampDocuments,
  deleteImage,
  deleteDocuments,
};
