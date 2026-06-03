package br.com.treinaweb.twjobs.core.service;


// import br.com.treinaweb.twjobs.core.exceptions.NegocioException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("$spring.mail.username")
    private String remetente;



    @Async
    public void enviarEmailTexto(String destinatario, String assunto, String mensagem){

//          throw new NegocioException("Teste.");
        try {
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(remetente);
            // simpleMailMessage.setFrom("paulowrkstdy@gmail.com");
            simpleMailMessage.setTo(destinatario);
            // simpleMailMessage.setTo("paulowrkstdy@gmail.com");
            simpleMailMessage.setSubject(assunto);
            simpleMailMessage.setText(mensagem);
            javaMailSender.send(simpleMailMessage);

            System.out.println("***");
            System.out.println("EMAIL ENVIADO PARA: "+destinatario);

            // return "Email enviado";
        } catch(Exception e){

            System.out.println("***");
            System.out.println("ERRO TENTATIVA ENVIO E-MAIL PARA: "+destinatario+e.getLocalizedMessage());

            // return "Erro ao tentar enviar e-mail" + e.getLocalizedMessage();
        }
    }




}
