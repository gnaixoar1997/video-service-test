package com.de.entity;

import org.springframework.stereotype.Component;
import sun.font.FontDesignMetrics;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 *  
 *  * @projectName videoservice
 *  * @title     ImgMarker   
 *  * @package    com.de.entity  
 *  * @description    视频加水印，暂时没用  
 *  * @author IT_CREAT     
 *  * @date  2020 2020/4/12 0012 下午 18:26  
 *  * @version V1.0.0 
 *  
 */
@Component
public class ImgMarker {
    /**
     * 视频水印图片
     */
    BufferedImage logoImg;

    private Font font;
    private Font font2;
    private FontDesignMetrics metrics;
    private FontDesignMetrics metrics2;

    private void init() {
        // 加水印图片
        try {
            ImageIO.read(new File(""));
        } catch (IOException e) {
            e.printStackTrace();
        }
        font = new Font("黑体", Font.BOLD, 16);
        font2 = new Font("黑体", Font.BOLD, 24);
        metrics = FontDesignMetrics.getMetrics(font);
        metrics2 = FontDesignMetrics.getMetrics(font2);
    }

    /**
     * 加水印
     * @param bufImg 视频帧
     */
    public void mark(BufferedImage bufImg) {
        if (bufImg == null || logoImg == null) {
            return;
        }
        int width = bufImg.getWidth();
        int height = bufImg.getHeight();
        Graphics2D graphics = bufImg.createGraphics();
        graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER));
        //设置图片背景
        graphics.drawImage(bufImg, 0, 0, width, height, null);
        //添加右上角水印
        graphics.drawImage(logoImg, width - 130, 8, 121, 64, null);
    }

    /**
     *
     * @param bufImg 视频帧
     */
    public void markTag(BufferedImage bufImg, String msg, int videoWidth) {
        int width = bufImg.getWidth();
        int height = bufImg.getHeight();
        Graphics2D graphics = bufImg.createGraphics();
        graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        graphics.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER));
        //设置图片背景
        graphics.drawImage(bufImg, 0, 0, width, height, null);
        //设置由上方标签号
        graphics.setColor(Color.orange);
        if (videoWidth <= 400) {
            graphics.setFont(font2);
            graphics.drawString(msg,  width - metrics2.stringWidth(msg) - 24, metrics2.getAscent());
        } else {
            graphics.setFont(font);
            graphics.drawString(msg,  width - metrics.stringWidth(msg) - 12, metrics.getAscent());
        }
        graphics.dispose();
    }
}
