package com.de.controller;

import com.de.entity.AjaxResult;
import com.de.rtsp.MediaVideoTransfer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * * @projectName videoservice
 * * @title IndexController
 * * @package com.de.controller
 * * @description  首页
 * * @author IT_CREAT     
 * * @date  2020 2020/5/17/017 5:15  
 * * @version c1.0.0
 */
@Slf4j
@Controller
public class IndexController {
    AtomicInteger sign = new AtomicInteger();

    ConcurrentHashMap<Integer, String> pathMap = new ConcurrentHashMap<>();
    ConcurrentHashMap<Integer, PipedOutputStream> outputStreamMap = new ConcurrentHashMap<>();
    ConcurrentHashMap<Integer, PipedInputStream> inputStreamMap = new ConcurrentHashMap<>();

    @GetMapping("/")
    public String indexView() {
        return "index";
    }

    @GetMapping("/test")
    public String testView() {
        return "test";
    }

    @PostMapping("/putVideo")
    @ResponseBody
    public AjaxResult putVideoPath(String path) {
        try {
            int id = sign.getAndIncrement();
            pathMap.put(id, path);
            PipedOutputStream pipedOutputStream = new PipedOutputStream();
            PipedInputStream pipedInputStream = new PipedInputStream();
            pipedOutputStream.connect(pipedInputStream);
            outputStreamMap.put(id, pipedOutputStream);
            inputStreamMap.put(id, pipedInputStream);
            return AjaxResult.success(id);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return AjaxResult.error();
        }
    }

    @GetMapping("/getVideo")
    public void getVideo(HttpServletRequest request, HttpServletResponse response, int id) {
        log.info("进来了" + id);
        String path = pathMap.get(id);
        String[] split = new File(path).getName().split("\\.");
        response.addHeader("Content-Disposition", "attachment;filename=" + split[0] + ".flv");
        try {
            ServletOutputStream outputStream = response.getOutputStream();
            write(id, outputStream);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }

    private void write(int id, OutputStream outputStream) {
        try {
            String path = pathMap.get(id);
            PipedOutputStream byteOutputStream = outputStreamMap.get(id);
//            print(new FileInputStream("F:\\视频\\体育素材\\篮球视频素材\\哇哈体育\\篮球\\有片头进球集锦亚运决赛分p（中国vs伊朗）\\2018亚运男篮决赛台语解说剪辑版2三部分.mp4"), outputStream);
            new Thread(() -> {
                MediaVideoTransfer mediaVideoTransfer = new MediaVideoTransfer();
                mediaVideoTransfer.setOutputStream(byteOutputStream);
                mediaVideoTransfer.setRtspTransportType("udp");
                mediaVideoTransfer.setRtspUrl(path);
                mediaVideoTransfer.live();
            }).start();

            print(inputStreamMap.get(id), outputStream);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private void print(InputStream inputStream, OutputStream outputStream) throws IOException {
        byte[] buffer = new byte[1024];
        int length;
        while ((length = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, length);
        }
    }

    public static void main(String[] args) throws FileNotFoundException {
        IndexController indexController = new IndexController();
        AjaxResult ajaxResult = indexController.putVideoPath("F:\\视频\\体育素材\\篮球视频素材\\哇哈体育\\篮球\\有片头进球集锦亚运决赛分p（中国vs伊朗）\\2018亚运男篮决赛台语解说剪辑版2三部分.mp4");
        indexController.write((int) ajaxResult.get("data"), new FileOutputStream("F:\\视频\\体育素材\\篮球视频素材\\哇哈体育\\篮球\\有片头进球集锦亚运决赛分p（中国vs伊朗）\\2018亚运男篮决赛台语解说剪辑版2三部分(负担).flv"));
    }
}
