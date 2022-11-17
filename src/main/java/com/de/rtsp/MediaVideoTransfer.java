package com.de.rtsp;

import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.javacv.*;

import java.io.OutputStream;

/**
 * 转换rtsp为flv
 *
 * @author IT_CREATE
 * @date 2021/6/8 12:00:00
 */
@Slf4j
public class MediaVideoTransfer {
    @Setter
    private OutputStream outputStream;

    @Setter
    private String rtspUrl;

    @Setter
    private String rtspTransportType;

    private FFmpegFrameGrabber grabber;

    private FFmpegFrameRecorder recorder;

    private boolean isStart = false;


    /**
     * 视频帧率
     */
    public static int frameRate = 25;
    /**
     * 视频宽度
     */
    public static int frameWidth = 1600;
    /**
     * 视频高度
     */
    public static int frameHeight = 900;


    /**
     * 开启获取rtsp流
     */
    public void live(String path) {
        log.info("连接rtsp：" + path + ",开始创建grabber");
        boolean isSuccess = createGrabber(path);
        if (isSuccess) {
            log.info("创建grabber成功");
        } else {
            log.info("创建grabber失败");
        }
        startCameraPush(path);
    }

    /**
     * 构造视频抓取器
     *
     * @param rtsp 拉流地址
     * @return 创建成功与否
     */
    private boolean createGrabber(String rtsp) {
        // 获取视频源
        try {
            int width = 1600, height = 900;
            grabber = FFmpegFrameGrabber.createDefault(rtsp);
            grabber.setOption("rtsp_transport", "tcp"); // tcp方式防止丢包
            grabber.setImageWidth(width);
            grabber.setImageHeight(height);
            grabber.start();


            recorder = new FFmpegFrameRecorder(outputStream, grabber.getImageWidth(), grabber.getImageHeight(), grabber.getAudioChannels());
            recorder.setInterleaved(true);
            recorder.setVideoOption("tune", "zerolatency"); // 降低编码延时
            recorder.setVideoOption("preset", "ultrafast"); // 提升编码速度
            recorder.setVideoOption("crf", "28"); // 视频质量参数(详见 https://trac.ffmpeg.org/wiki/Encode/H.264)
            recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);
            recorder.setFormat("flv"); // 封装格式flv rtmp使用
            recorder.setVideoBitrate(2000000);
            recorder.setFrameRate(25); // 视频帧率(保证视频质量的情况下最低25，低于25会出现闪屏)
            recorder.setPixelFormat(0);
            recorder.setAudioQuality(0);// 最高质量
            recorder.setAudioBitrate(192000);// 音频比特率
            recorder.setSampleRate(44100);// 音频采样率
            recorder.setAudioChannels(grabber.getAudioChannels());// 双通道(立体声) 2（立体声）；1（单声道）；0（无音频）
            recorder.setAudioCodec(avcodec.AV_CODEC_ID_AAC);// 音频编/解码器


            isStart = true;
            return true;
        } catch (FrameGrabber.Exception e) {
            log.error("创建解析rtsp FFmpegFrameGrabber 失败");
            log.error("create rtsp FFmpegFrameGrabber exception: ", e);
            stop();
            reset();
            return false;
        }
    }

    /**
     * 推送图片（摄像机直播）
     */
    private void startCameraPush(String path) {
        if (grabber == null) {
            log.info("重试连接rtsp：" + path + ",开始创建grabber");
            boolean isSuccess = createGrabber(path);
            if (isSuccess) {
                log.info("创建grabber成功");
            } else {
                log.info("创建grabber失败");
            }
        }
        try {
            if (grabber != null) {
                recorder.start();
                Frame frame;
                while (isStart && (frame = grabber.grabFrame()) != null) {
//                while (isStart && (frame = grabber.grabImage()) != null) {
//                    recorder.setTimestamp(grabber.getTimestamp());
                    recorder.record(frame);
                }

                stop();
                reset();
            }
        } catch (FrameGrabber.Exception | RuntimeException | FrameRecorder.Exception e) {
            log.error(e.getMessage(), e);
            stop();
            reset();
        }
    }

    private void stop() {
        try {
            if (recorder != null) {
                recorder.stop();
                recorder.release();
            }
            if (grabber != null) {
                grabber.stop();
                grabber.release();
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private void reset() {
        recorder = null;
        grabber = null;
        isStart = false;
    }
}
