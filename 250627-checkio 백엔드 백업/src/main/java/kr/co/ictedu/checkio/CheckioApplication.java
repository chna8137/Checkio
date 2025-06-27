package kr.co.ictedu.checkio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class CheckioApplication {

	public static void main(String[] args) {
		SpringApplication.run(CheckioApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer crosConfigurer() {
		return new WebMvcConfigurer() {

			@Override
			public void addCorsMappings(CorsRegistry registry) {

				registry.addMapping("/**")
						.allowedOrigins(
								"http://192.168.0.38:3001",
								"http://192.168.0.38:3000",
								"http://localhost:3001",
								"http://localhost:3000",
								"http://127.0.0.1:3001",
								"http://127.0.0.1:3000")
						.allowedHeaders("*")
						.allowedMethods("*")
						.allowCredentials(true)
						.maxAge(3600);
			}

		};
	}

}
