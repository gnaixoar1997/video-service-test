package com.de.build;

import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.FFmpegFrameRecorder;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.FrameGrabber;

import java.io.File;
import java.io.FileOutputStream;

/**
 * 该类的作用
 *
 * @author IT_CREAT     
 * @date  2021 2021/6/7/007 20:58  
 */
public class Mp4Test {

    /**
     * 获取视频时长 单位/秒
     *
     * @param video
     * @return
     */
    public static long getVideoDuration(File video) {
        long duration = 0L;
        FFmpegFrameGrabber ff = new FFmpegFrameGrabber(video);
        try {
            ff.start();
            duration = ff.getLengthInTime() / (1000 * 1000);
            ff.stop();
        } catch (FrameGrabber.Exception e) {
            e.printStackTrace();
        }
        return duration;
    }

    /**
     * 转换视频文件为mp4
     *
     * @param file
     * @return
     */
    public static String convertToMp4(File file) {

        FFmpegFrameGrabber frameGrabber = new FFmpegFrameGrabber(file);
        String fileName = null;

        Frame captured_frame = null;

        FFmpegFrameRecorder recorder = null;

        try {
            frameGrabber.start();
            fileName = file.getAbsolutePath() + "__1.flv";
            String finalFileName = fileName;
            // 用输出流构造不能输出MP4格式，MP4不支持流媒体
            FileOutputStream fileOutputStream = new FileOutputStream(finalFileName);
            recorder = new FFmpegFrameRecorder(fileOutputStream, frameGrabber.getImageWidth(), frameGrabber.getImageHeight(), frameGrabber.getAudioChannels());
            // 文件构造支持输出MP4格式
            //recorder = new FFmpegFrameRecorder(file.getAbsolutePath() + "__1.mp4", frameGrabber.getImageWidth(), frameGrabber.getImageHeight(), frameGrabber.getAudioChannels());
            recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264); //avcodec.AV_CODEC_ID_H264  //AV_CODEC_ID_MPEG4
            recorder.setFormat("flv");
            //recorder.setFormat("mp4");
            recorder.setFrameRate(frameGrabber.getFrameRate());
            //recorder.setSampleFormat(frameGrabber.getSampleFormat());
            recorder.setSampleRate(frameGrabber.getSampleRate());

            recorder.setAudioChannels(frameGrabber.getAudioChannels());
            recorder.setFrameRate(frameGrabber.getFrameRate());
            recorder.start();
            while ((captured_frame = frameGrabber.grabFrame()) != null) {
                try {
                    recorder.setTimestamp(frameGrabber.getTimestamp());
                    recorder.record(captured_frame);
                    System.out.println(captured_frame.toString());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            recorder.stop();
            recorder.release();
            frameGrabber.stop();
        } catch (Exception e) {
            e.printStackTrace();
        }
        //file.delete();
        return fileName;
    }

    public static void main(String[] args) {
        File file = new File("F:\\视频\\体育素材\\篮球视频素材\\哇哈体育\\篮球\\有片头进球集锦亚运决赛分p（中国vs伊朗）\\2018亚运男篮决赛台语解说剪辑版2二部分.mp4");
        System.out.println(getVideoDuration(file) + "/秒");

        System.out.println(convertToMp4(file));
    }


}
