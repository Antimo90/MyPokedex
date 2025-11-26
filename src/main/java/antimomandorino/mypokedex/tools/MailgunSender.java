package antimomandorino.mypokedex.tools;

import antimomandorino.mypokedex.entities.User;
import kong.unirest.core.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MailgunSender {

    private String domain;

    private String apiKey;

    public MailgunSender(@Value("${mailgun.domain}") String domain, @Value("${mailgun.apiKey}") String apiKey) {
        this.domain = domain;
        this.apiKey = apiKey;
    }

    public void sendRegistrationEmail(User recipient) {
        Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                .basicAuth("api", this.apiKey)
                .queryString("from", "gioco2.g@gmail.com")
                .queryString("to", recipient.getEmail())
                .queryString("subject", "Registration completed")
                .queryString("text", "Welcome " + recipient.getUsername() + " to our platform, we hope you can complete your Pokédex!")
                .asJson();
    }

    public void sendProfileUpdateEmail(User recipient) {
        Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                .basicAuth("api", this.apiKey)
                .queryString("from", "gioco2.g@gmail.com")
                .queryString("to", recipient.getEmail())
                .queryString("subject", "Profile updated successfully") // Oggetto modificato
                .queryString("text", "Hello " + recipient.getUsername() +
                        ", your profile information has been successfully updated. " +
                        "If you did not request this change, please contact support immediately.") // Corpo modificato
                .asJson();
    }
}

