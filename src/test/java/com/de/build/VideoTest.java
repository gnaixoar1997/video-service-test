package com.de.build;

import com.de.rtsp.MediaVideoTransfer;

import java.io.FileOutputStream;

/**
 *  
 *  * @projectName videoservice
 *  * @title     VideoTest   
 *  * @package    com.de.build  
 *  * @description    该类的作用描述，必填  
 *  * @author IT_CREAT     
 *  * @date  2020 2020/4/11 0011 下午 21:15  
 *  * @version V1.0.0 
 *  
 */
public class VideoTest {

    public static void main(String[] args) throws Exception {
//        String file = "rtsp://127.0.0.1:8554/video";
//        FFmpegFrameGrabber grabber = FFmpegFrameGrabber.createDefault(file);
//        grabber.setOption("rtsp_transport", "udp"); // 使用tcp的方式，不然会丢包很严重
//
//        // 一直报错的原因！！！就是因为是 2560 * 1440的太大了。。
//        grabber.setImageWidth(960);
//        grabber.setImageHeight(540);
//        System.out.println("grabber start");
//        grabber.start();
//        CanvasFrame canvasFrame = new CanvasFrame("测试RSTP");
//        canvasFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//        canvasFrame.setAlwaysOnTop(true);
//        OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
//        // OpenCVFrameConverter.ToIplImage converter = new OpenCVFrameConverter.ToIplImage();
//        while (true) {
//            Frame frame = grabber.grabImage();
//            Buffer[] image = frame.image;
//            Mat mat = converter.convertToMat(frame);
//            canvasFrame.showImage(frame);
//        }


        test1();
    }

    private static void test1() throws Exception {
        FileOutputStream fileOutputStream = new FileOutputStream("F:\\视频\\体育素材\\篮球视频素材\\哇哈体育\\篮球\\有片头进球集锦亚运决赛分p（中国vs伊朗）\\2018亚运男篮决赛台语解说剪辑版2三部分.flv");
        MediaVideoTransfer mediaVideoTransfer = new MediaVideoTransfer();
        mediaVideoTransfer.setOutputStream(fileOutputStream);
        mediaVideoTransfer.setRtspTransportType("udp");
        mediaVideoTransfer.setRtspUrl("F:\\视频\\体育素材\\篮球视频素材\\哇哈体育\\篮球\\有片头进球集锦亚运决赛分p（中国vs伊朗）\\2018亚运男篮决赛台语解说剪辑版2三部分.mp4");
        mediaVideoTransfer.live();

        fileOutputStream.close();
    }
}
