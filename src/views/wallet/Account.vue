<template>
  <div class="account">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="1"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <div class="asset">
            <p class="l0">法币账户总资产：</p>
            <p class="l1">
              <span class="big bright">约: {{balance.numBtc}}</span>
              <span class="small"> BTC</span>
              <span class="big">/</span>
              <span class="big bright">{{balance.numCny}}</span>
              <span class="small"> CNY</span>
            </p>
          </div>
          <div class="asset as2">
            <p class="l0">币币账户总资产：</p>
            <p class="l1">
              <span class="big bright">约: {{balance2.numBtc}}</span>
              <span class="small"> BTC</span>
              <span class="big">/</span>
              <span class="big bright">{{balance2.numCny}}</span>
              <span class="small"> CNY</span>
            </p>
          </div>
          <div class="filter">
            <div class="f1">
              <SearchGroup ref="sg" onSearch="onSearch" placeText="搜索币种"></SearchGroup>
            </div>
            <div class="f2" v-show="tab===0">
              <span class="radio r2" :class="{check:isZero}" @click="isZero=!isZero,isPetty=false">隐藏0余额币种</span>
              <span class="radio r2" :class="{check:isPetty}" @click="isPetty=!isPetty,isZero=false">隐藏小额币种</span>
              <span class="checkbox r3" :class="{check:isNoWa}" @click="isNoWa=!isNoWa">隐藏非钱包币种</span>
            </div>
          </div>
          <div class="tb-tab">
            <ul>
              <li :class="{active:tab===0}" @click="tab=0">法币账户</li>
              <li :class="{active:tab===1}" @click="tab=1">币币账户</li>
            </ul>
            <p class="tb-tab-r" v-show="tab===1">
              <i>币币交易需要资产划转</i>
              <a :href="'https://www.qb.com/home/?token='+token" target="_blank" class="btn green">币币交易</a>
            </p>
          </div>
          <!--法币账户-->
          <div class="fb" v-show="tab===0">
            <!--表头-->
            <div class="thead">
              <p class="th coin sortable" @click="fbSubSort=++fbSubSort%2">币种
                <i :class="{up:fbSubSort===0,down:fbSubSort===1}"></i></p>
              <p class="th name sortable" @click="fbSubSort=++fbSubSort%2+2">全称
                <i :class="{up:fbSubSort===2,down:fbSubSort===3}"></i></p>
              <p class="th avail sortable" @click="fbSort=++fbSort%2">可用余额
                <i :class="{up:fbSort===0,down:fbSort===1}"></i></p>
              <p class="th frozen sortable" @click="fbSort=++fbSort%2+2" title="出售未完成、担保未完成">冻结中余额
                <i :class="{up:fbSort===2,down:fbSort===3}"></i></p>
              <p class="th assess sortable" @click="fbSort=++fbSort%2+4">估值(CNY)
                <i :class="{up:fbSort===4,down:fbSort===5}"></i></p>
              <p class="th opera">操作</p>
            </div>
            <!--fb返回结果-->
            <div v-if="fbErr===0">
              <div v-for="(e,i) in fb">
                <div class="li">
                  <p class="coin"><img :src="e.icon">{{e.abbr}}</p>
                  <p class="name">{{e.name}}</p>
                  <p class="avail"><span>{{e.avail}}</span></p>
                  <p class="frozen"><span>{{e.frozen}}</span></p>
                  <p class="assess"><span>{{e.assess}}</span></p>
                  <p class="opera op1" v-if="e.hasWallet">
                    <router-link tag="a" class="btn white" :to="'/wallet/charge?coin='+e.abbr">充币</router-link>
                    <!--<a class="btn white" :href="'/#/wallet/withdraw'+e.abbr">提币</a>-->
                    <router-link tag="a" class="btn white" :to="'/transaction?icon='+e.icon0+'&currency='+e.abbr+'&name='+e.name">交易</router-link>
                  </p>
                  <p class="opera op2" v-else="">
                    <button class="btn green" @click="createWallet(i)">加入钱包</button>
                    <router-link tag="a" :to="'/coinData?coin='+e.abbr" target="_blank">查看币种资料</router-link>
                  </p>
                </div>
              </div>
              <Pagination :total="fbTotal" :pageSize="fbPageSize" :curPage="fbCurPage" onPageChange="onFbPageChange"></Pagination>
            </div>
            <div v-else-if="fbErr===1">
              <div class="err no-result">无相应的数据</div>
            </div>
            <div v-else-if="fbErr===2">
              <div class="err load-failed">网络异常</div>
            </div>
            <div v-else-if="fbErr===3">
              <div class="err net-error">服务器错误</div>
            </div>
            <div v-else-if="fbErr===4">
              <div class="err loading">数据加载中...</div>
            </div>
            <div v-else>
              <div class="err empty">无账户数据</div>
            </div>
          </div>
          <!--币币账户-->
          <div class="bb" v-show="tab===1">
            <!--表头-->
            <div class="thead">
              <p class="th coin sortable" @click="bbSort=++bbSort%2">币种
                <i :class="{up:bbSort===0,down:bbSort===1}"></i></p>
              <p class="th name sortable" @click="bbSort=++bbSort%2+2">全称
                <i :class="{up:bbSort===2,down:bbSort===3}"></i></p>
              <p class="th avail sortable" @click="bbSort=++bbSort%2+4">可用余额
                <i :class="{up:bbSort===4,down:bbSort===5}"></i></p>
              <p class="th frozen sortable" @click="bbSort=++bbSort%2+6">冻结中余额
                <i :class="{up:bbSort===6,down:bbSort===7}"></i></p>
              <p class="th assess sortable" @click="bbSort=++bbSort%2+8">估值(BTC)
                <i :class="{up:bbSort===8,down:bbSort===9}"></i></p>
              <p class="th opera">操作</p>
            </div>
            <!--bb返回结果-->
            <div v-if="bbErr===0">
              <div class="li" v-for="(e,i) in bb" :key="i">
                <p class="coin"><img :src="e.icon">{{e.name}}</p>
                <p class="name">{{e.fullName}}</p>
                <p class="avail">{{e.avail}}</p>
                <p class="frozen">{{e.frozen}}</p>
                <p class="assess">{{e.assess}}</p>
                <p class="opera op3"><router-link tag="a" :to="'/wallet/conversion?coin='+e.name" class="btn white">资产转入</router-link></p>
              </div>
              <Pagination :total="bbTotal" :pageSize="bbPageSize" :curPage="bbCurPage" onPageChange="onBbPageChange"></Pagination>
            </div>
            <div v-else-if="bbErr===1">
              <div class="err no-result">无相应的数据</div>
            </div>
            <div v-else-if="bbErr===2">
              <div class="err load-failed">网络异常</div>
            </div>
            <div v-else-if="bbErr===3">
              <div class="err net-error">服务器错误</div>
            </div>
            <div v-else-if="bbErr===4">
              <div class="err loading">数据加载中...</div>
            </div>
            <div v-else-if="bbErr===5">
              <div class="err empty">未开通币币账户，请先 <a :href="'https://www.qb.com/home/?token='+token" target="_blank">开通</a></div>
            </div>
            <div v-else>
              <div class="err empty">无账户数据</div>
            </div>
          </div>
        </div>
        <!--提示框-->
        <Alert ref="alert"></Alert>
      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  import Pagination from "../verify/component/Pagination";
  import Alert from "../common/widget/Alert";
  import SearchGroup from "../common/widget/SearchGroup";
  export default {
    components: {
      SearchGroup,
      Alert,
      Pagination,
      Notify,
      LeftBar,
    },
    data() {
      return {
        tab: 0,  //0-法币账户,1-币币账户
        isZero: false,
        isPetty: false,
        isNoWa: false,

        prices:{},
        balance:{
          numBtc: 0,
          numCny: 0,
        },
        balance2:{
          numBtc: 0,
          numCny: 0,
        },

        fbSort: 1, //
        fbSubSort :1,
        fb: [],
        fbCurPage: 1,
        fbPageSize: 20,
        fbTotal: 0,
        fbErr:4,

        bbSort: 0,  //
        bb: [],         // 当前页数据
        bbAll: [],    //币币账户全部数据
        bbCurPage: 1,
        bbPageSize: 20,
        bbTotal: 0,
        bbErr:4,
      }
    },
    computed:{
      token:function(){
        return this.$store.state.token;
      },
      paramSrchText:function(){
        return this.$refs.sg.srchText;
      },
      paramFbSort:function(){
        let sort=this.fbSort;
        switch(sort){
          case 0:sort=2;break;
          case 1:sort=1;break;
          case 2:sort=4;break;
          case 3:sort=3;break;
          case 4:sort=6;break;
          case 5:sort=5;break;
          default:sort=5;break;
        }
        return sort;
      },
      paramFbSubSort:function(){
        let sort=this.fbSubSort;
        switch(sort){
          case 0:sort=2;break;
          case 1:sort=1;break;
          case 2:sort=4;break;
          case 3:sort=3;break;
          default:sort=2;break;
        }
        return sort;
      }
    },
    watch:{
      isZero:function(){
        if(this.tab===0){
          this.loadFb();
        }else{
          this.loadBb();
        }
      },
      isNoWa:function(){
        if(this.tab===0){
          this.loadFb();
        }else{
          this.loadBb();
        }
      },
      fbSort:function(){
        this.loadFb();
      },
      fbSubSort:function(){
        this.loadFb();
      },
      bbSort:function() {
        this.loadBb();
      }
    },
    methods:{
      async init(){
        try{
          // 查询价格
          let data=await this.Proxy.getPrice().catch((msg)=>{
            console.log(msg);
          });
          if(data && data.data && data.data.prices){
            let prices=data.data.prices;
            prices.forEach((e)=>{
              this.prices[e.currency.toLowerCase()]=e.cny;
            })
          }
          //加载法币账户信息
          this.loadFbBalance();
          this.loadFb();
          //获取交易所钱包
          let exData = await this.Proxy.hp_gp({ // 币币账户
            a: "gp",
            d: {}
          });

          //let exData = {"va":0,"vae":0,"vac":0,"cl":[{"cid":3,"cn":"bch","fn":"Bitcoin Cash","cic":"https://www.qb.com/res/bch.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1},{"cid":4,"cn":"eth","fn":"Ethereum","cic":"https://www.qb.com/res/eth.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1},{"cid":9,"cn":"ltc","fn":"Litecoin","cic":"https://www.qb.com/res/ltc.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1},{"cid":36,"cn":"usdt","fn":"USDT","cic":"https://www.qb.com/res/usdt.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1},{"cid":0,"cn":"btc","fn":"Bitcoin","cic":"https://www.qb.com/res/btc.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1},{"cid":2,"cn":"lsk","fn":"LISK","cic":"https://www.qb.com/res/lsk.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1},{"cid":7,"cn":"dash","fn":"Dash","cic":"https://www.qb.com/res/dash.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1},{"cid":10,"cn":"omg","fn":"OmiseGO","cic":"https://www.qb.com/res/omg.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1},{"cid":38,"cn":"zec","fn":"Zcash","cic":"https://www.qb.com/res/zec.png","avc":0,"frc":0,"va":0,"vae":0,"vac":0,"c":1,"w":1,"e":1}]};

          //判断用户在交易所是否存在
          if(!exData || !exData.d){
            this.bbErr=5;
          }else if(!exData.d.cl){
            this.bbErr=1;
          }else{
            this.bbErr=0;
            exData.d.cl.map(item=>{
              this.bbAll.push({
                icon: item.cic,
                name: item.cn,
                fullname: item.fn,
                lock: item.frc,
                balance: item.avc,
                btc_value: item.va,
              });
            });
            //排序
            this.bbAll.sort((a,b)=>{
              return a.name<b.name?-1:1;
            });
            //获取账户总资产
            this.balance2={
              numBtc: exData.d.va && exData.d.va.toString().formatFixed(6),
              numCny: exData.d.vac && exData.d.vac.toString().formatFixed(2)
            };
         }
          this.loadBb();

        }catch (e) {
          console.log(e);
        }
      },
      createWallet(i){
        let curr=this.fb[i].abbr.toLowerCase();
        this.WsProxy.send("wallet", "new_wallet",{currency:curr}).then((data)=> {
          this.loadFb();
        }).catch(()=>{
          this.$refs.alert.showAlert({content:"创建钱包失败"});
        });
      },

      //法币账户
      loadFbBalance(){
        this.WsProxy.send("wallet","total_assets", {}).then((data)=>{
          let numBtc=data.total_assets || 0;
          let btcPrice=this.prices["btc"] || 0;
          this.balance.numBtc=numBtc.toString().formatFixed(6);
          this.balance.numCny=(numBtc * btcPrice).toString().formatFixed(2);
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      loadFb(p=0){
        this.WsProxy.send("wallet","wallets_v2",{
          currency: this.paramSrchText,
          hide_zero: this.isZero,
          hide_low_price: this.isPetty,
          hide_no_wallet: this.isNoWa,
          sort: this.paramFbSort,
          sub_sort:this.paramFbSubSort,
          page: p,
          count: this.fbPageSize,
        }).then((data)=>{
          if(!data||!data.wallets||data.wallets.length<=0){
            this.fbErr=1; //无数据
          }else{
            this.fbErr=0;
            this.fbTotal=data.count;
            this.parseFb(data.wallets);
          }
        }).catch((msg)=>{
          if(!msg){
            this.fbErr=2; //网络异常
          }else if(msg.ret!==0){
            this.fbErr=3; //加载异常
          }
        });
      },
      parseFb(data){
        this.fb=[];
        data.forEach((e)=>{
          let item={};
          item.hasWallet=(e.address!=null);
          item.icon=this.HostUrl.http + "/image/"+e.icon;
          item.icon0=e.icon;
          item.abbr=e.currency.toUpperCase();
          item.name=e.name;
          item.avail=item.hasWallet?"0":"-";
          if(e.balance!=null) {
            item.avail = e.balance.toString().formatFixed(6);
          }
          item.frozen=item.hasWallet?"0":"-";
          if(e.locked!=null) {
            item.frozen = e.locked.toString().formatFixed(6);
          }
          item.assess=item.hasWallet?"0":"-";
          if(e.assessment!=null && this.prices["btc"]!=null) {
            item.assess = (e.assessment * this.prices["btc"]).toString().formatFixed(2);
          }
          this.fb.push(item);
        });
      },

      //插入排序,compare(a,b)：升序 return a<b,降序 return a>b
      insertSort(arr,compare){
        for(let j=0;j<arr.length-1;j++){
          for(let i=0;i<arr.length-1-j;i++){
            if(!compare(arr[i],arr[i+1])){
              let temp = arr[i];
              arr[i] = arr[i+1];
              arr[i+1] = temp;
            }
          }
        }
      },

      loadBb(p=0){
        let arr=[];
        //模糊搜索
        this.bbAll.forEach(e=>{
          if(new RegExp("^"+this.paramSrchText+".*$","i").test(e.name)){
            arr.push(e);
          }
        });
        //排序
        this.insertSort(arr,(a,b)=>{
          switch(this.bbSort){
            case 0: return a.name<=b.name;
            case 1: return a.name>=b.name;
            case 2: return a.fullname<=b.fullname;
            case 3: return a.fullname>=b.fullname;
            case 4: return a.balance<=b.balance;
            case 5: return a.balance>=b.balance;
            case 6: return a.lock<=b.lock;
            case 7: return a.lock>=b.lock;
            case 8: return a.btc_value<=b.btc_value;
            case 9: return a.btc_value>=b.btc_value;
          }
        });
        if(arr.length<=0){
          this.bbErr=1;
          return;
        }
        this.bbErr=0;
        this.bbTotal=arr.length;
        this.bb=[];
        let size=this.bbPageSize;
        let oi=p*size;
        for(let i=oi;i-oi<size&&i<arr.length;i++){
          let e=arr[i];
          this.bb.push({
            icon: e.icon,
            name: e.name.toUpperCase(),
            fullName: e.fullname,
            avail: e.balance && e.balance.toString().formatFixed(6),
            frozen: e.lock && e.lock.toString().formatFixed(6),
            assess: e.btc_value && e.btc_value.toString().formatFixed(6),
          });
        }
      },
    },
    mounted(){
      this.init();
      this.Bus.$on("onSearch",()=>{
        if(this.tab===0){
          this.loadFb();
        }else{
          this.loadBb();
        }
      });
      this.Bus.$on("onFbPageChange",(p)=>{
        this.fbCurPage=p;
        this.loadFb(p-1);
      });
      this.Bus.$on("onBbPageChange",(p)=>{
        this.bbCurPage=p;
        this.loadBb(p-1);
      });
    },
    destroyed(){
      this.Bus.$off();
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base"
  @import "../common/stylus/common"
  @import "./stylus/common"
  @import "./stylus/account"
</style>
