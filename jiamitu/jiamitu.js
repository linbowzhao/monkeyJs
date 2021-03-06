// ==UserScript==
// @name         加密兔
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       linbow
// @require      http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js
// @match        https://jiamitu.mi.com/home
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $('body').append($('<button id="jio" style="position:fixed;top:10px;right:50%;z-index:1000;background:#eeeeee">jio本<button/>'));
    $('#jio').click(function(){
        $('#jio').remove();
        var app1 = $('<div id="app1"> <div class="contain"> <div class="searchArea"> <label for="rare">品阶：</label> <select type="text" name="rareDegree" id="rare" v-model="rare"> <option value="">所有</option> <option value="0">普通</option> <option value="1">稀有1</option> <option value="2">稀有2</option> <option value="3">罕见3</option> <option value="4">罕见4</option> <option value="5">史诗5</option> <option value="5">史诗6</option> <option value="7">传奇7</option> <option value="8">传奇8</option> </select> <label for="orderBy">方式：</label> <select type="text" name="orderBy" id="orderBy" v-model="orderBy"> <option value="update_time">时间</option> <option value="generation">代数</option> <option value="bid_price">价格</option> </select> <label for="order">顺序：</label> <select type="text" name="order" id="order" v-model="order"> <option value="asc">上升</option> <option value="desc">下降</option> </select> <br> <label for="page">页码:</label> <input type="number" name="page" id="page" v-model="page" placeholder="请输入数字"> <button @click="searchData">查询</button><button @click="prePage">上</button> <button @click="nextPage">下</button> <div>一共{{total}}只</div> </div> <div class="searchArea"> <label>代数小于:</label> <input type="number" v-model="generation" placeholder="请输入数字"> <br> <label>价格小于:</label> <input v-model="priceHigh" placeholder="请输入数字"> </div> <div class="pet-list" @click.prevent="buyJump"> <pet-box v-for="pet in search.searchResult" v-bind:pet="pet" v-bind:pet-id="pet.id"></pet-box> </div> </div> </div>');
        var sty = $('<style> html, body { margin: 0; padding: 0; font-size: .3rem } .contain { margin: 0 auto; max-width: 7.5rem; padding: .5rem .3rem; } .pet-list { display: flex; flex-flow: row wrap; justify-content: space-between; } .pet-box { display: inline-block; margin-top: .5rem; width: 2rem; } .contain:after { content: \'\'; display: inline-block; width: 2rem; } .pet-box p { line-height: 1; padding: 0; margin: 0; font-size: .23rem; background-color: #eeeeee; } .searchArea { text-align: center; border: solid 1px orange; } input { width: 1.5rem; } button { width: 1.5rem; } </style>');
        $('#app').remove();
        $('body').prepend(app1);
        $('head').append(sty);
        Vue.component('pet-box', {
            props: ['pet'],
            template: `
     <div class="pet-box">
      <p>{{pet.name}}</p>
      <p>{{pet.rareDegree}}</p>
      <p>{{pet.price}}胡萝卜</p>
      <p>{{pet.generation}}代</p>
    </div>
  `
        });
        new Vue({
            el:'#app1',
            data: {
                total:'未知',
                rare: '',
                orderBy: 'update_time',
                order: 'desc',
                page: '1',
                petList: [],
                generation: '',
                priceHigh: ''
            },
            methods:{
                getData:function(page, limit, order, orderBy, rare){
                    var url = 'https://jiamitu.mi.com/pet/ng/listng?';
                    var that = this;
                    url = url + 'page=' + page + '&limit=' + limit + '&order=' + order + '&orderBy=' + orderBy + '&rare=' + rare;
                    console.log(url);
                    $.get(url,function(data){
                        console.log(data);
                        that.total = data.result.total;
                        that.petList = data.result.data;
                        console.log(that);
                    });
                },
                searchData:function(){
                    this.getData(this.page, '50', this.order, this.orderBy, this.rare);
                },
                nextPage:function(){
                    this.page++;
                    this.searchData();
                },
                prePage:function(){
                    this.page++;
                    this.searchData();
                },
                buyJump: function(event){
                    if($(event.path[1]).attr('class')==='pet-box'){
                        window.open('https://jiamitu.mi.com/babydetail?petId=' + $(event.path[1]).attr('pet-id'));
                    }
                }
            },
            computed:{
                search: function(){
                    var newList = [],
                        that = this;
                    if(that.generation===''&&that.priceHigh===''){
                        newList = that.petList.slice();
                    }else{
                        that.petList.forEach(function(item){
                            if(that.generation!==''&&that.priceHigh===''&&(item.generation <= parseInt(that.generation))){
                                newList.push(item);
                            }
                            if(that.generation===''&&that.priceHigh!==''&&item.price <= parseInt(that.priceHigh)){
                                newList.push(item);
                            }
                            if(that.generation!==''&&that.priceHigh!==''&&item.price <= parseInt(that.priceHigh)&&(item.generation <= parseInt(that.generation))){
                                newList.push(item);
                            }
                        });
                    }
                    return {
                        generation: that.generation,
                        priceHigh: that.priceHigh,
                        searchResult:newList
                    }
                }
            },
            created:function(){
                this.getData(this.page, '50', this.order, this.orderBy, this.rare);
            }
        });
    });
})();