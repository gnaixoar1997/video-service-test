/**
 * 定义正则表达式验证规则
 * @type {{plane: RegExp, electricVehicleLicence: RegExp, idCard: RegExp, licencePlate: RegExp, telephone: RegExp, url: RegExp, chinese: RegExp, number: RegExp, dateIso: RegExp, chineseAndLetterAndNumber: RegExp, letterAndNumber: RegExp, letter: RegExp, email: RegExp}}
 */
var FormVerifyRegEx = {
    //匹配中文
    chinese: /^[\u4e00-\u9fa5]{0,}$/,
    //匹配字母
    letter: /^[a-zA-Z]*$/,
    //匹配数字
    number: /^[0-9]*$/,
    //匹配字母和数字
    letterAndNumber: /^[a-zA-Z0-9]*$/,
    //匹配中文和字母
    chineseAndLetter: /^[\u4e00-\u9fa5a-zA-Z]+$/,
    //匹配中文字母和数字
    chineseAndLetterAndNumber: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
    //匹配中文字母数字和下划线
    chineseAndLetterAndNumberAndUnder: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
    //匹配中文字母数字和下划线和短横线
    chineseAndLetterAndNumberAndLine: /^[\u4e00-\u9fa5a-zA-Z0-9_\-]+$/,
    //匹配手机号
    telephone: /^1[34578]\d{9}$/,
    //匹配座机号
    plane: /^(0\d{2,3}-)?\d{7,8}$/g,
    //匹配电子邮箱
    email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
    //匹配身份证
    idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    //匹配传统汽车牌照
    licencePlate: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
    //匹配电动车牌照
    electricVehicleLicence: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$/,
    //匹配url
    url: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
    //匹配日期格式(yy-MM-dd)
    dateIso: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
    //匹配微信账号
    wxAccount: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/
};

/**
 * 向jquery表单验证追加验证方法
 */
$(function () {
    var stringUtil = new StringUtil();
    /**
     * 验证6-12位账号
     * 传入true,表示开启验证
     */
    jQuery.validator.addMethod("accountExtend", function (value, element, params) {
        var autoCreatAccountAndPassword = false;
        if (!stringUtil.isEmptyForString(params)) {
            autoCreatAccountAndPassword = $("[name='" + params + "']").val();
        }
        var length = value.length;
        if (autoCreatAccountAndPassword === true) {
            return this.optional(element);
        }
        return (FormVerifyRegEx.letterAndNumber.test(value) && length >= 6 && length <= 12);
    }, "<i class='fa fa-times-circle'>账号必须为6-12位字母和数字组合</i>");

    /**
     * 验证密码
     * 传入true,表示开启验证
     */
    jQuery.validator.addMethod("passwordExtend", function (value, element) {
        var length = value.length;
        return this.optional(element) || (FormVerifyRegEx.letterAndNumber.test(value) && length >= 8 && length <= 20);
    }, "<i class='fa fa-times-circle'>密码必须为8-12位字母和数字组合</i>");

    /**
     * 验证昵称
     * 传入true,表示开启验证
     */
    jQuery.validator.addMethod("nicknameExtend", function (value, element) {
        var chineseAndOtherLength = 0;
        var numberAndLetter = 0;
        for (var i = 0; i < value.length; i++) {
            if (FormVerifyRegEx.number.test(value.substr(i, 1)) || FormVerifyRegEx.letter.test(value.substr(i, 1))) {
                numberAndLetter++;
            } else {
                chineseAndOtherLength++;
            }
        }
        var length = chineseAndOtherLength + numberAndLetter / 2;
        return this.optional(element) || (length >= 1 && length <= 20);
    }, "<i class='fa fa-times-circle'>昵称必须在1-20个中文，1个符号相当于1个中文，2个数字/英文相当于1个中文</i>");

    /**
     * 验证汽车牌照
     * 传入true,表示开启验证
     */
    jQuery.validator.addMethod("licenceExtend", function (value, element) {
        var length = value.length;
        return this.optional(element) || (FormVerifyRegEx.licencePlate.test(value)) || (FormVerifyRegEx.electricVehicleLicence.test(value));
    }, "<i class='fa fa-times-circle'>汽车牌照格式输入错误</i>");


    /**
     * 验证微信账号
     * 传入true,表示开启验证
     */
    jQuery.validator.addMethod("wxAccountExtend", function (value, element) {
        var length = value.length;
        return this.optional(element) || (FormVerifyRegEx.wxAccount.test(value));
    }, "<i class='fa fa-times-circle'>可以使用6-20个子母、数字、下划线和减号，必须以字母开头</i>");

    /**
     * 验证数字
     * 传入true表示必须是数字，
     * "false"输入内容不能包含数字,
     * "other"表示是输入内容不能全是数字
     */
    $.validator.addMethod("numberExtend", function (value, element, params) {
        if (params === true) {
            $.validator.messages.numberExtend = "<i class='fa fa-times-circle'>输入内容必须是数字</i>";
            return this.optional(element) || (FormVerifyRegEx.number.test(value));
        } else if (params === "false") {
            var sign = true;
            for (var i = 0; i < value.length; i++) {
                if (FormVerifyRegEx.number.test(value.substr(i, 1))) {
                    $.validator.messages.numberExtend = "<i class='fa fa-times-circle'>输入内容不能包含数字</i>";
                    sign = false;
                    break;
                }
            }
            return this.optional(element) || sign;
        }
        $.validator.messages.numberExtend = "<i class='fa fa-times-circle'>输入内容不能全是数字</i>";
        return this.optional(element) || !(FormVerifyRegEx.number.test(value));
    });

    /**
     * 验证中文
     * 传入true表示必须是中文，
     * "false" 表示是输入内容不能包含中文,
     * "other" 表示是输入内容不能全是中文
     */
    $.validator.addMethod("chineseExtend", function (value, element, params) {
        if (params === true) {
            $.validator.messages.chineseExtend = "<i class='fa fa-times-circle'>输入内容必须是中文</i>";
            return this.optional(element) || (FormVerifyRegEx.chinese.test(value));
        } else if (params === "false") {
            var sign = true;
            for (var i = 0; i < value.length; i++) {
                if (FormVerifyRegEx.chinese.test(value.substr(i, 1))) {
                    $.validator.messages.chineseExtend = "<i class='fa fa-times-circle'>输入内容不能包含中文</i>";
                    sign = false;
                    break;
                }
            }
            return this.optional(element) || sign;
        }
        $.validator.messages.chineseExtend = "<i class='fa fa-times-circle'>输入内容不能全是中文</i>";
        return this.optional(element) || !(FormVerifyRegEx.chinese.test(value));
    });

    /**
     * 验证英文字母
     * 传入true表示必须是字母，
     * "false"表示输入内容不能包含英文字母，
     * "other"表示输入内容不能是纯字母
     */
    $.validator.addMethod("letterExtend", function (value, element, params) {
        if (params === true) {
            $.validator.messages.letterExtend = "<i class='fa fa-times-circle'>输入内容必须是英文字母</i>";
            return this.optional(element) || (FormVerifyRegEx.letter.test(value));
        } else if (params === "false") {
            var sign = true;
            for (var i = 0; i < value.length; i++) {
                if (FormVerifyRegEx.letter.test(value.substr(i, 1))) {
                    $.validator.messages.letterExtend = "<i class='fa fa-times-circle'>输入内容不能包含英文字母</i>";
                    sign = false;
                    break;
                }
            }
            return this.optional(element) || sign;
        }
        $.validator.messages.letterExtend = "<i class='fa fa-times-circle'>输入内容不能全是英文字母</i>";
        return this.optional(element) || !(FormVerifyRegEx.letter.test(value));
    });

    /**
     * 验证字母、数字
     * 传入true表示必须是字母、数字，
     * "false"表示输入内容不能包含数字或字母，
     * "other" 表示是输入内容除了包含数字或字母，还必须包含额外字符
     */
    $.validator.addMethod("letterAndNumberExtend", function (value, element, params) {
        if (params === true) {
            $.validator.messages.letterAndNumberExtend = "<i class='fa fa-times-circle'>输入内容必须是字母、数字</i>";
            return this.optional(element) || (FormVerifyRegEx.letterAndNumber.test(value));
        } else if (params === "false") {
            var sign = true;
            for (var i = 0; i < value.length; i++) {
                if (FormVerifyRegEx.letterAndNumber.test(value.substr(i, 1))) {
                    $.validator.messages.letterAndNumberExtend = "<i class='fa fa-times-circle'>输入内容不能包含数字或字母</i>";
                    sign = false;
                    break;
                }
            }
            return this.optional(element) || sign;
        }
        $.validator.messages.letterAndNumberExtend = "<i class='fa fa-times-circle'>输入内容除了包含数字或字母，还必须包含额外字符</i>";
        return this.optional(element) || !(FormVerifyRegEx.letterAndNumber.test(value));
    });


    /**
     * 验证字母、中文
     * 传入true表示必须是字母、中文，
     * "false"表示输入内容不能包含字母或中文，
     * "other"表示是除了包含字母或中文，还必须包含额外字符
     */
    $.validator.addMethod("chineseAndLetterExtend", function (value, element, params) {
        if (params === true) {
            $.validator.messages.chineseAndLetterExtend = "<i class='fa fa-times-circle'>输入内容必须是字母、中文</i>";
            return this.optional(element) || (FormVerifyRegEx.chineseAndLetter.test(value));
        } else if (params === "false") {
            var sign = true;
            for (var i = 0; i < value.length; i++) {
                if (FormVerifyRegEx.chineseAndLetter.test(value.substr(i, 1))) {
                    $.validator.messages.chineseAndLetterExtend = "<i class='fa fa-times-circle'>输入内容不能包含字母或中文</i>";
                    sign = false;
                    break;
                }
            }
            return this.optional(element) || sign;
        }
        $.validator.messages.chineseAndLetterExtend = "<i class='fa fa-times-circle'>输入内容除了包含字母或中文，还必须包含额外字符</i>";
        return this.optional(element) || !(FormVerifyRegEx.chineseAndLetter.test(value));
    });

    /**
     * 验证字母、数字、中文
     * 传入true表示必须是字母、数字、中文，
     * "false"表示输入内容不能包含字母、数字或中文，
     * "other"表示是除了包含字母、数字或中文，还必须包含额外字符
     */
    $.validator.addMethod("chineseAndLetterAndNumberExtend", function (value, element, params) {
        if (params === true) {
            $.validator.messages.chineseAndLetterAndNumberExtend = "<i class='fa fa-times-circle'>输入内容必须是字母、数字、中文</i>";
            return this.optional(element) || (FormVerifyRegEx.chineseAndLetterAndNumber.test(value));
        } else if (params === "false") {
            var sign = true;
            for (var i = 0; i < value.length; i++) {
                if (FormVerifyRegEx.chineseAndLetterAndNumber.test(value.substr(i, 1))) {
                    $.validator.messages.chineseAndLetterAndNumberExtend = "<i class='fa fa-times-circle'>输入内容不能包含字母、数字或中文</i>";
                    sign = false;
                    break;
                }
            }
            return this.optional(element) || sign;
        }
        $.validator.messages.chineseAndLetterAndNumberExtend = "<i class='fa fa-times-circle'>输入内容除了包含字母、数字或中文，还必须包含额外字符</i>";
        return this.optional(element) || !(FormVerifyRegEx.chineseAndLetterAndNumber.test(value));
    });


    /**
     * 验证字母、数字、中文、下划线
     * 传入true表示必须是字母、数字、中文，
     * "false"表示输入内容不能包含字母、数字、中文或下划线，
     * "other"表示是除了包含字母、数字、中文或下划线，还必须包含额外字符
     */
    $.validator.addMethod("chineseAndLetterAndNumberAndUnderExtend", function (value, element, params) {
        if (params === true) {
            $.validator.messages.chineseAndLetterAndNumberAndUnderExtend = "<i class='fa fa-times-circle'>输入内容必须是字母、数字、中文、下划线</i>";
            return this.optional(element) || (FormVerifyRegEx.chineseAndLetterAndNumberAndUnder.test(value));
        } else if (params === "false") {
            var sign = true;
            for (var i = 0; i < value.length; i++) {
                if (FormVerifyRegEx.chineseAndLetterAndNumberAndUnder.test(value.substr(i, 1))) {
                    $.validator.messages.chineseAndLetterAndNumberAndUnderExtend = "<i class='fa fa-times-circle'>输入内容不能包含字母、数字、中文或下划线</i>";
                    sign = false;
                    break;
                }
            }
            return this.optional(element) || sign;
        }
        $.validator.messages.chineseAndLetterAndNumberAndUnderExtend = "<i class='fa fa-times-circle'>输入内容除了包含字母、数字、中文或下划线，还必须包含额外字符</i>";
        return this.optional(element) || !(FormVerifyRegEx.chineseAndLetterAndNumberAndUnder.test(value));
    });


    /**
     * 验证字母、数字、中文、下划线、短横线
     * 传入true表示必须是字母、数字、中文、短横线，
     * "false"表示输入内容不能包含字母、数字、中文、下划线或短横线，
     * "other"表示是除了包含字母、数字、中文、下划线或短横线，还必须包含额外字符
     */
    $.validator.addMethod("chineseAndLetterAndNumberAndLineExtend", function (value, element, params) {
        if (params === true) {
            $.validator.messages.chineseAndLetterAndNumberAndLineExtend = "<i class='fa fa-times-circle'>输入内容必须是字母、数字、中文、下划线、短横线</i>";
            return this.optional(element) || (FormVerifyRegEx.chineseAndLetterAndNumberAndLine.test(value));
        } else if (params === "false") {
            var sign = true;
            for (var i = 0; i < value.length; i++) {
                if (FormVerifyRegEx.chineseAndLetterAndNumberAndLine.test(value.substr(i, 1))) {
                    $.validator.messages.chineseAndLetterAndNumberAndLineExtend = "<i class='fa fa-times-circle'>输入内容不能包含字母、数字、中文、下划线或短横线</i>";
                    sign = false;
                    break;
                }
            }
            return this.optional(element) || sign;
        }
        $.validator.messages.chineseAndLetterAndNumberAndLineExtend = "<i class='fa fa-times-circle'>输入内容除了包含字母、数字、中文、下划线或短横线，还必须包含额外字符</i>";
        return this.optional(element) || !(FormVerifyRegEx.chineseAndLetterAndNumberAndLine.test(value));
    });


    /**
     * 最小长度
     */
    $.validator.addMethod("minLengthExtend", function (value, element, params) {
        var sign = true;
        if (!stringUtil.isEmptyForString(value) && value.length < params) {
            sign = false;
            $.validator.messages.minLengthExtend = "<i class='fa fa-times-circle'>长度必须大于等于" + params + "</i>";
        }
        return this.optional(element) || sign;
    });

    /**
     * 最大长度
     */
    $.validator.addMethod("maxLengthExtend", function (value, element, params) {
        var sign = true;
        if (!stringUtil.isEmptyForString(value) && value.length > params) {
            sign = false;
            $.validator.messages.maxLengthExtend = "<i class='fa fa-times-circle'>长度必须小于等于" + params + "</i>";
        }
        return this.optional(element) || sign;
    });

    /**
     * 验证身份证
     * 传入参数为true，即开启验证
     */
    jQuery.validator.addMethod("idNumberExtend", function (value, element) {
        var length = value.length;
        return this.optional(element) || (FormVerifyRegEx.idCard.test(value));
    }, "<i class='fa fa-times-circle'>身份证件号输入格式有误</i>");

    /**
     * 验证邮箱
     * 传入参数为true，即开启验证
     */
    jQuery.validator.addMethod("emilExtend", function (value, element) {
        var length = value.length;
        return this.optional(element) || (FormVerifyRegEx.email.test(value));
    }, "<i class='fa fa-times-circle'>邮箱格式输入错误</i>");

    /**
     * 验证手机号码
     * 传入参数为true，即开启验证
     */
    jQuery.validator.addMethod("telephoneExtend", function (value, element) {
        return this.optional(element) || (FormVerifyRegEx.telephone.test(value))
    }, "<i class='fa fa-times-circle'>请输入正确的11位有效手机号码</i>");

    /**
     * 验证座机号码
     * 传入参数为true，即开启验证
     */
    jQuery.validator.addMethod("planeExtend", function (value, element) {
        return this.optional(element) || (FormVerifyRegEx.plane.test(value))
    }, "<i class='fa fa-times-circle'>请输入正确的8位有效座机号码</i>");

    /**
     * 验证url地址
     * 传入参数为true，即开启验证
     */
    jQuery.validator.addMethod("urlExtend", function (value, element) {
        return this.optional(element) || (FormVerifyRegEx.url.test(value))
    }, "<i class='fa fa-times-circle'>请输入正确的URL地址链接</i>");

    /**
     * 验证时间格式为yy-MM-dd
     * 传入参数为true，即开启验证
     */
    jQuery.validator.addMethod("dateExtend", function (value, element) {
        return this.optional(element) || (FormVerifyRegEx.dateIso.test(value))
    }, "<i class='fa fa-times-circle'>请输入格式为yy-MM-dd</i>");


    /**
     * 后台检测唯一性
     * 传入参数params为数组，第一个参数是传到后台的名字，第二个是url地址，第三个为错误提示信息
     * 格式为：checkUniquenessExtend:["telephone",ctx + "vip/customer/checkPhone","手机号已经存在"]这种
     */
    jQuery.validator.addMethod("checkUniquenessExtend", function (value, element, params) {
        if (stringUtil.isEmptyForString(value)) {
            return this.optional(element);
        }
        if (stringUtil.isEmptyForObject(params) || params.length < 3) {
            return this.optional(element);
        }
        var data = {};
        data[params[0]] = value.trim();
        var isUniqueness = true;
        $.ajax({
            type: "POST",
            url: params[1],
            data: data,
            async: false,
            success: function (result) {
                if (result.code === 0) {
                    isUniqueness = true;
                } else {
                    isUniqueness = false;
                    $.validator.messages.checkUniquenessExtend = "<i class='fa fa-times-circle'>" + params[2] + "</i>";
                }

            },
            error: function () {
                $.validator.messages.checkUniquenessExtend = "提交数据出错";
            }
        });
        return this.optional(element) || isUniqueness;
    });

    /**
     * 校验输入唯一性，相同name数据，校验是否已经输入
     * 传入格式：第一个传入值为相同name元素的name值，第二个为错误信息提示
     * 例子：inputUniquenessExtend:["telephones","该手机号已经输入过了"]
     */
    jQuery.validator.addMethod("inputUniquenessExtend", function (value, element, params) {
        if (stringUtil.isEmptyForString(value)) {
            return this.optional(element);
        }
        if (stringUtil.isEmptyForObject(params) || params.length < 2) {
            return this.optional(element);
        }
        var isUniqueness = true;
        var obj = $("input[name ='" + params[0] + "']");
        if (!stringUtil.isEmptyForObject(obj) && obj.length > 1) {
            $("input[name='" + params[0] + "']").each(function () {
                if (value === $(this).val() && element.id != $(this).attr("id")) {
                    isUniqueness = false;
                    $.validator.messages.inputUniquenessExtend = "<i class='fa fa-times-circle'>" + params[1] + "</i>";
                    return false;
                }
            });
        }
        return this.optional(element) || isUniqueness;
    });

    /**
     * 根据单选按钮的不同值选择性校验，不能为空
     * params传入参数值
     * 第一个参数值对应单选按钮的name名字
     * 第二个参数值对应需要校验的输入框的id值
     * 第三个参数值对应需要校验输入框对应的单选按钮的值
     * 第四个参数值对应校验失败的提示错误信息
     */
    jQuery.validator.addMethod("radioUniquenessExtend", function (value, element, params) {
        if (stringUtil.isEmptyForObject(params) || params.length < 4) {
            return this.optional(element);
        }
        var isUniqueness = true;
        var radioCheck = $("input[name='" + params[0] + "']:checked").val();//获得单选按钮的值
        var currentElementId = element.getAttribute("id");//获得当前元素的id值

        if (!stringUtil.isEmptyForObject(radioCheck) && radioCheck === params[2] && currentElementId === params[1]) {
            if (stringUtil.isEmptyForString(value)) {
                isUniqueness = false;
                $.validator.messages.radioUniquenessExtend = "<i class='fa fa-times-circle'>" + params[3] + "</i>";
                return false;
            }
        }
        return this.optional(element) || isUniqueness;
    });

    /**
     * 根据check选择按钮的不同值选择性校验，不能为空
     * params传入参数值
     * 第一个参数值对应check按钮的id值
     * 第二个参数值对应需要校验的输入框的id值
     * 第三个参数值对应需要校验输入框对应的单选按钮的值
     * 第四个参数值对应校验失败的提示错误信息
     */
    jQuery.validator.addMethod("checkBoxUniquenessExtend", function (value, element, params) {
        if (stringUtil.isEmptyForObject(params) || params.length < 4) {
            return this.optional(element);
        }
        var isUniqueness = true;
        var checkVal = $("#" + params[0]).val();//获得check按钮的值
        var currentElementId = element.getAttribute("id");//获得当前元素的id值

        if (!stringUtil.isEmptyForObject(checkVal) && checkVal === params[2] && currentElementId === params[1]) {
            if (stringUtil.isEmptyForString(value)) {
                isUniqueness = false;
                $.validator.messages.checkBoxUniquenessExtend = "<i class='fa fa-times-circle'>" + params[3] + "</i>";
                return false;
            }
        }
        return this.optional(element) || isUniqueness;
    });

    /**
     * 当传入的第一个值等于第二个值时必填
     * 传入参数两个,第一个bootstrap 表名 ，第二个数量
     */
    jQuery.validator.addMethod("equalNumberRequiredExtend", function (value, element, params) {
        if (stringUtil.isEmptyForObject(params) || params.length < 2) {
            return this.optional(element);
        }
        var rows = $('#'+params[0]).bootstrapTable('getData');
        var isUniqueness = true;
        if (!stringUtil.isEmptyForObject(params) && rows.length === params[1]) {
            if(stringUtil.isEmptyForString(value)){
                isUniqueness = false;
                $.validator.messages.equalNumberRequiredExtend = "<i class='fa fa-times-circle'>该项必填</i>";
                return false;
            }
        }
        return this.optional(element) || isUniqueness;
    });
});


/**
 * 解决jquery表单验证name值相同只验证第一个的问题
 */
$(function () {
    function jqueryVerify() {
        if ($.validator) {
            $.validator.prototype.elements = function () {
                var validator = this,
                    rulesCache = {};
                // Select all valid inputs inside the form (no submit or reset buttons)
                return $(this.currentForm)
                    .find("input, select, textarea, [contenteditable]")
                    .not(":submit, :reset, :image, :disabled")
                    .not(this.settings.ignore)
                    .filter(function () {
                        var name = this.id || this.name || $(this).attr("name"); // For contenteditable
                        if (!name && validator.settings.debug && window.console) {
                            console.error("%o has no name assigned", this);
                        }
                        // Set form expando on contenteditable
                        if (this.hasAttribute("contenteditable")) {
                            this.form = $(this).closest("form")[0];
                        }
                        // Select only the first element for each name, and only those with rules specified
                        if (name in rulesCache || !validator.objectLength($(this).rules())) {
                            return false;
                        }
                        rulesCache[name] = true;
                        return true;
                    });
            }
        }
    }

    jqueryVerify();
});


/**
 * 提示信息及定位方法
 * @param msg 显示的提示信息
 * @param idName 要定位的元素id
 * @param time 提示层显示时间
 * @param slideTime 滑动到错误地点时间
 */
function tips(msg, idName, time, slideTime) {
    layer.tips(msg, '#' + idName, {
        tips: [1, '#3595CC'],
        time: time
    });
    $("html,body").animate({scrollTop: $("#" + idName).offset().top}, slideTime);
}

/*   jQuery.validator()内置方法
* required()	Boolean	必填验证元素。
required(dependency-expression)	Boolean	必填元素依赖于表达式的结果。
required(dependency-callback)	Boolean	必填元素依赖于回调函数的结果。
remote(url)	Boolean	请求远程校验。url 通常是一个远程调用方法。
minlength(length)	Boolean	设置最小长度。
maxlength(length)	Boolean	设置最大长度。
rangelength(range)	Boolean	设置一个长度范围 [min,max]。
min(value)	Boolean	设置最小值。
max(value)	Boolean	设置最大值。
email()	Boolean	验证电子邮箱格式。
range(range)	Boolean	设置值的范围。
url()	Boolean	验证 URL 格式。
date()	Boolean	验证日期格式（类似 30/30/2008 的格式，不验证日期准确性只验证格式）。
dateISO()	Boolean	验证 ISO 类型的日期格式。
dateDE()	Boolean	验证德式的日期格式（29.04.1994 或 1.1.2006）。
number()	Boolean	验证十进制数字（包括小数的）。
digits()	Boolean	验证整数。
creditcard()	Boolean	验证信用卡号。
accept(extension)	Boolean	验证相同后缀名的字符串。
equalTo(other)	Boolean	验证两个输入框的内容是否相同。
phoneUS()	Boolean	验证美式的电话号码。
*
* */
