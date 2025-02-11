package com.ssafy.scentify.favorite;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
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
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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

    public Map<String, String> downloadAndUploadImage(String imageUrl) {
    	try {
            // 이미지 다운로드
            URL url = new URL(imageUrl);
            URLConnection connection = url.openConnection();
            InputStream inputStream = connection.getInputStream();
            BufferedImage image = ImageIO.read(inputStream);
            inputStream.close();

            // PNG 변환
            String fileName = "images/" + UUID.randomUUID() + ".png"; // S3 저장 경로
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, "png", os);
            byte[] imageBytes = os.toByteArray();

            // S3 업로드
            InputStream imageInputStream = new ByteArrayInputStream(imageBytes);
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/png");
            metadata.setContentLength(imageBytes.length);
            
            amazonS3.putObject(bucketName, fileName, imageInputStream, metadata);
            Map<String, String> s3Info = new HashMap<>();
            s3Info.put("imageName", fileName);
            s3Info.put("s3Url", generatePresignedUrl(bucketName, fileName, amazonS3, 10));
            
            // 10분 간 유효한 url과 파일 이름 전달
            return s3Info;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    public String generatePresignedUrl(String bucketName, String fileName, AmazonS3 amazonS3, int expirationMinutes) {
        Date expiration = new Date();
        expiration.setTime(expiration.getTime() + expirationMinutes * 60 * 1000); 

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
            new GeneratePresignedUrlRequest(bucketName, fileName)
                							.withMethod(HttpMethod.GET) // GET 요청만 허용
                							.withExpiration(expiration);

        URL presignedUrl = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        return presignedUrl.toString();
    }
}

