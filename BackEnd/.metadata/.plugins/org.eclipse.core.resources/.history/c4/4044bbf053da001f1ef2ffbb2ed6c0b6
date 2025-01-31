package com.ssafy.scentify.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.ssafy.scentify.util.CodeProvider;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import javax.mail.*;

@Slf4j
@Service
public class EmailService {
	@Value("${GOOGLE_EMAIL}") private String fromEmail;
	private final JavaMailSender mailSender;
	private final TemplateEngine templateEngine;
	
	public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
		this.mailSender = mailSender;
		this.templateEngine = templateEngine;
	}
	
	public void sendVerificationEmail(String email, String verifyCode) throws MessagingException {
		// Thymeleaf 컨텍스트 생성
        Context context = new Context();
        context.setVariable("verifyCode", verifyCode);

        // 템플릿 처리
        String htmlContent = templateEngine.process("email-template", context);

        // 메일 작성
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(email);
        helper.setSubject("Scentify 인증 코드");
        helper.setText(htmlContent, true); 
        
        // 메일 전송
        mailSender.send(message);
	}
	
	
}
