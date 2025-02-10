package com.ssafy.scentify.favorite;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

@Service
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;
    
    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String uploadFile(byte[] data, String fileName, String contentType) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(data.length);
        metadata.setContentType(contentType);

        ByteArrayInputStream inputStream = new ByteArrayInputStream(data);
        amazonS3.putObject(new PutObjectRequest(bucketName, fileName, inputStream, metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        return amazonS3.getUrl(bucketName, fileName).toString();
    }
}

