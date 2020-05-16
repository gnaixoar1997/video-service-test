package com.de;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.ConfigurableApplicationContext;

/**
 * 启动程序
 *
 * @author ruoyi
 */
@ServletComponentScan
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class Application {
    public static void main(String[] args) {
        // System.setProperty("spring.devtools.restart.enabled", "false");
        ConfigurableApplicationContext run = SpringApplication.run(Application.class, args);
        System.out.println("\033[36;4m" + "(♥◠‿◠)ﾉﾞ  系统启动成功   ლ(´ڡ`ლ)ﾞ  "+ "\033[0m" +"\n" +
                "     ___           ___           ___                 " + "\n"+
                "    /\\  \\         /\\__\\         /\\  \\             " + "\n"+
                "   /:/\\:\\  \\     /:|:|  |      /:/\\ \\  \\                 " + "\n"+
                "  /:/\\:\\ \\:\\__\\ /:/ |::::\\__\\ /\\ \\:\\ \\ \\__\\         " + "\n"+
                " /__\\:\\/:/  / \\/__/~~/:/  / \\:\\ \\:\\ \\/__/            " + "\n"+
                "    \\::/  /        /:/  /   \\:\\ \\:\\__\\           " +"\n"+
                "   /:/  /        /:/  /     \\:\\/:/  /              " +"\n"+
                " /:/  /        /:/  /       \\::/  /              " + "\n"+
                "\\/__/         \\/__/         \\/__/              " );


    }
}