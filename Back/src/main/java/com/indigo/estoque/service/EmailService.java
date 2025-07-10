package com.indigo.estoque.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.destinatarios}")
    private String emailsDestinatarios;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarPedidoCompra(String nomeProduto) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Divide a string em array usando vírgula e remove espaços
        String[] emails = emailsDestinatarios.split("\\s*,\\s*");

        helper.setTo(emails);
        helper.setSubject("Pedido de Compra Automático");
        helper.setText("Pedido de compra automático!\nVocê deve realizar a compra do produto *" + nomeProduto + "*, ele está em baixa no estoque.");

        mailSender.send(message);
    }
}
