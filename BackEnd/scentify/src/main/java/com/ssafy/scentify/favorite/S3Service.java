package com.ssafy.scentify.favorite;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.UUID;

import javax.imageio.ImageIO;

@Service
public class S3Service {
	
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;
    
    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String downloadAndUploadImage(String imageUrl) {
    	try {
            // 1. 이미지 다운로드
            URL url = new URL(imageUrl);
            URLConnection connection = url.openConnection();
            InputStream inputStream = connection.getInputStream();
            BufferedImage image = ImageIO.read(inputStream);
            inputStream.close();
            System.out.println("이미지 다운로드 되니?");

            // 2. PNG 변환
            String fileName = "images/" + UUID.randomUUID() + ".png"; // S3 저장 경로
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, "png", os);
            byte[] imageBytes = os.toByteArray();
            System.out.println("PNG 변환 되니?");

            // 3. S3 업로드
            InputStream imageInputStream = new ByteArrayInputStream(imageBytes);
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/png");
            metadata.setContentLength(imageBytes.length);
            System.out.println("S3 업로드 되니?");

            amazonS3.putObject(bucketName, fileName, imageInputStream, metadata);

            return amazonS3.getUrl(bucketName, fileName).toString(); // S3 URL 반환

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

