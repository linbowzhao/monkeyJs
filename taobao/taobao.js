// ==UserScript==
// @name         �Ա�����
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  �Ա�����
// @author       linbow
// @match        https://cart.taobao.com/cart.htm?*
// @require      http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @match       https://buy.taobao.com/auction/order/confirm_order.htm?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
        var href = window.location.href;
    if(href.match('https://cart.taobao.com/cart.htm?')){
        $(document).ready(function(){
            console.log('1111');
            $('body').append('<div id="linbowBox" style="z-index:1000;position: fixed;width: 300px;height:150px;padding:50px 30px 0 30px;background: #fff8e1;border-radius: 20px;left: 35%;top: 5%;">\
                              ��ʼ����ʱ�䣺\
                              <input class="hour" type="text" style="height: 23px;width: 40px;text-align: center;margin: 0 12px;border:solid #efbba9 1px">ʱ\
                              <input class="min" type="text" style="height: 23px;width: 40px;text-align: center;margin: 0 12px;border:solid #efbba9 1px">��<br/>\
                              <button class="startBtn" style="background: #f22d00;border: none;border-radius: 4px;width: 60px;height:40px;color:white;float: right;margin: 40px 15px 0 0">��ʼ</button>\
                              </div>');
                /**
                 *  ʱ�䴦����
                 * @param {string} hour �趨��ʱ��Сʱ,{string} min �趨��ʱ�����
                 * @return {object} ����ʱ�����
                 */
            function dateEdit(hour, min){
                var now = new Date(),
                    strtime = now.getFullYear();
                strtime+=('-'+(now.getMonth()>8?(now.getMonth()+1):('0'+(now.getMonth()+1))));
                strtime+=('-'+(now.getDate()>9?now.getDate():('0'+now.getDate())));
                strtime+=(' '+(hour>9?hour:('0'+hour)));
                strtime+=(':'+(min>9?min:('0'+min))+':00:000');
                var date = new Date(strtime.replace(/-/g, '/'));
                return date;
            }
            $('body .startBtn').click(function(){
                var hourEl = $('body .hour'),
                    minEl = $('body .min');
                if($('#J_Go').attr('class').match('submit-btn-disabled')){
                  alert('��ѡ�������Ĳ�Ʒ')
                }else if(hourEl.val()===''||minEl.val()===''||Number(hourEl.val())>23||Number(minEl.val())>59||Number(hourEl.val())<0||Number(minEl.val())<0){
                    alert('��������ȷ��ʱ��')
                }else{
                    $('#linbowBox').hide();
                    var hour = hourEl.val(),
                        min = minEl.val();
                    var time = dateEdit(parseInt(hour),parseInt(min));
                    console.log(time-new Date());
                    function workFun(){
                        var id = setInterval(function(){
                            if(time-new Date()<0){
                                console.log(2222);
                               $('#J_Go span').click();
                               clearInterval(id);
                            }
                            console.log(1)
                        },100);
                    }
                    if(time-new Date()>240000){
                        settimeout(function(){
                            workFun();
                        },time-newDate()-240000);
                    }else{
                        workFun();
                    }
                }
            });
        })
    }else if(href.match('https://buy.taobao.com/auction/order/confirm_order.htm?')){
        document.getElementsByClassName("go-btn")[0].click();
    }
})();