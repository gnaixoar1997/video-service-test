package com.de.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * * @projectName videoservice
 * * @title IndexController
 * * @package com.de.controller
 * * @description  首页
 * * @author IT_CREAT     
 * * @date  2020 2020/5/17/017 5:15  
 * * @version c1.0.0
 */
@Controller
public class IndexController {

    @GetMapping("/")
    public String indexView(){
        return "index";
    }

}
