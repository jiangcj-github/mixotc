<template>
  <div class="rule-wrap inner">
    <h1>
      <router-link to="">mixOTC帮助中心</router-link> -
      <span v-for="(item,index) in titleList" v-if="showActive == index"> {{item}}</span>
    </h1>
    <div class="clearfix">
      <ul class="title-ul">
        <li v-for="(item,index) in titleList" @click="selectTab(index)" :class="{active: index == showActive}">{{item}}</li>
      </ul>
      <div class="content-wrap">
        <div class="rule-content" v-if="showActive == 0">
          <h2>交易规则</h2>
          <ol>
            <li v-for="content in ruleList">{{content}}</li>
          </ol>
        </div>
        <div class="rate-wrap" v-if="showActive == 1">
          <h2>费率说明</h2>
          <h3>交易费用：</h3>
          <p class="last-p">创建广告免费，成功交易后，广告方支付每笔交易0.5%，直接搜索交易下单的用户无需承担交易费用</p>
          <h3>提币费用：</h3>
          <p v-for="(content, index) in rateList" :class="{'last-p': index == 3}">{{content}}</p>
          <h3>担保费用：</h3>
          <p>每完成一笔担保，收取担保币数量的0.1%。只收取发起担保方担保费，接受担保方免费。</p>
        </div>
        <div class="buy-wrap" v-if="showActive == 2">
          <h2>如何购买数字币</h2>
          <span>在 MIXOTC 上您有两种方式可以购买数字币，一种是搜索广告，另一种是刊登购买数字币广告。</span>
          <h3>第一种：搜索购买广告，并下单购买（此处以购买BTC为例）</h3>
          <div v-for="content in buyListFirst">
            <h4>{{content.title}}</h4>
            <p class="last-p">{{content.info}}</p>
          </div>
          <h3>第二种：通过刊登数字币购买广告，等待卖家下单</h3>
          <div v-for="content in buyListSecond">
            <h4>{{content.title}}</h4>
            <p class="last-p">{{content.info}}</p>
          </div>
        </div>
        <div class="sale-wrap" v-if="showActive == 3">
          <h2>如何出售数字货币</h2>
          <span>在OTCBTC上您有两种方式可以出售数字币，一种是搜索广告，另一种是刊登出售数字币广告。</span>
          <h3>第一种：搜索出售广告，并下单出售（此处以出售 BTC 为例）</h3>
          <div v-for="content in saleListFirst">
            <h4>{{content.title}}</h4>
            <p class="last-p">{{content.info}}</p>
          </div>
          <h3>第二种：通过刊登数字币出售广告，等待买家下单</h3>
          <div v-for="content in saleListSecond">
            <h4>{{content.title}}</h4>
            <p class="last-p">{{content.info}}</p>
          </div>
        </div>
        <div class="agreement-wrap" v-if="showActive == 4">
          <h2>用户协议</h2>
          <span>MIXOTC网络服务条款是由MIXOTC团队与MIXOTC用户就MIXOTC平台的各项服务所制定的相关权利义务规范。 MIXOTC的运营者依据本协议为用户提供服务。用户访问或使用本APP，即表示已接受并同意本协议的所有条件和条款，同意将其作为确定双方权利义务的依据；不愿接受本协议的，不得访问或使用本APP。本协议不涉及MIXOTC用户与其他用户之间因比特币交易而产生的法律关系及法律纠纷。 注意：MIXOTC有权对本协议进行修改，请用户定期查看本协议。</span>
          <h3>一、服务内容</h3>
          <ol>
            <li v-for="content in serviceList">{{content}}</li>
          </ol>
          <h3>二、用户权利</h3>
          <ol>
            <li v-for="(content, index) in rightList">{{content}}
              <ul class="child-ul" v-if="index == 0">
                <li v-for="content in rightListChild">{{content}}</li>
              </ul>
            </li>
          </ol>
          <h3>三、用户义务</h3>
          <ol>
            <li v-for="content in dutyList">{{content}}</li>
          </ol>
          <h3>四、拒绝担保与免责</h3>
          <ol>
            <li v-for="content in refuseList">{{content}}</li>
          </ol>
          <h3>五、关于协议</h3>
          <ol>
            <li v-for="content in aboutList">{{content}}</li>
          </ol>
          <h3>六、服务的提供、修改及终止</h3>
          <ol>
            <li v-for="(content, index) in changeList">{{content}}
              <ul class="child-ul" v-if="index == 3">
                <li v-for="content in changeListChild">{{content}}</li>
              </ul>
            </li>
          </ol>
          <h3>七、免责声明</h3>
          <div v-for="content in stateLinst">
            <h5>{{content.title}}</h5>
            <p class="last-p">{{content.info}}</p>
          </div>
        </div>
        <div class="policy-wrap" v-if="showActive == 5">
          <h2>隐私政策</h2>
          <span>本隐私政策和声明解释了MIXOTC，如何 使用您的个人数据， 因为我们通过我们的数字资产（不涉及法定货币）交易平台为您提供访问和实用程序服务。在提供服务的过程中， 我们收集和维护个人信息。通常， 我们绝对不会向任何非附属第三方披露任何有关客户的个人信息， 除非下文所述的情况下。</span>
          <h3>一、数据收集目的和使用</h3>
          <div v-for="(content,index) in dataList">{{content}}
            <b v-if="index == 1">我们可能会与第三方分享您的个人资料：</b>
            <ol v-if="index == 1">
              <li v-for="content in dataListChild">{{content}}</li>
            </ol>
          </div>
          <h3>二、存储您的个人数据</h3>
          <p class="last-p">我们从您那收集的数据可能会转移并存储到其他目的地。 这些数据也可能由在MIXOTC以外的工作人员处理， 这些工作人员为我们或为我们的供应商工作。 您提交您的个人资料的行为， 即表示您同意上述转让、存储或处理。您提供给我们的所有信息都存储在我们和/或第三方云安全服务器上。</p>
          <h3>三、Cookies</h3>
          <p>我们从您那收集的数据可能会转移并存储到其他目的地。 这些数据也可能由在MIXOTC以外的工作人员处理， 这些工作人员为我们或为我们的供应商工作。 您提交您的个人资料的行为， 即表示您同意上述转让、存储或处理。您提供给我们的所有信息都存储在我们和/或第三方云安全服务器上。</p>
          <ol>
            <li v-for="content in cookiesList">{{content}}</li>
          </ol>
          <h3>四、联系MIXOTC关于隐私问题或疑虑</h3>
          <p v-for="(content, index) in problemList" :class="{'last-p': index == 2}">{{content}}</p>
          <h3>五、对我们的隐私政策的修改</h3>
          <p class="last-p">我们未来对我们的隐私政策的任何更改将会发布在此页面上， 我们将自行考虑， 也许会通过电子邮件通知您。 您使用我们的APP和服务的行为， 即表示您同意我们的隐私政策和声明。</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        titleList: ['交易规则', '费率说明', '如何购买数字币', '如何出售数字币', '用户协议', '隐私政策'],
        showActive: 0,
        ruleList: [
          '建议您在交易前先查看卖家信息，查看相关交易记录及评价，以減少交易纠纷。',
          '交易发起前，请确认卖家提出的条款，并与卖家聊天确认卖家在线，且再次确认订单详情无误后，点击确认下单。',
          '交易发起后，并在付款期限截止前转帐至卖家指定帐户，并标记已付款，逾期系统自动取消。',
          '交易发起后，系统自动将卖家的数字货币锁定，待卖家确认收到您的转帐后，会释放数字货币至您的帐户。',
          '交易过程请使用平台的聊天系统进行沟通，平台外的对话记录将无法作为交易纠纷的依据。'
        ],
        rateList: [
          '每笔提币均会消耗固定矿工费用，与提币数量无关，详情如下：',
          'BTC: 0.001 BTC/笔',
          'ETH: 0.001 ETH/笔',
          'EOS: 0.3 EOS/笔'
        ],
        buyListFirst: [
          {'title': 'Step1：', 'info': '在MIXOTC上使用电话号码或者邮箱注册一个账号。'},
          {'title': 'Step2：', 'info': '打开「交易中心」，币种选择BTC，选择购买按钮，通过筛选和排序找到自己想要交易的广告。'},
          {'title': 'Step3：', 'info': '单击「购买BTC」按钮，输入你想购买的人民币数量金额和BTC数量(在可交易量范围内)，之后确认购买金额及对应的数字币数量，阅读并同意OTC购买流程规则后勾选小方框，并点击「购买」按钮。'},
          {'title': 'Step4：', 'info': '创建订单后，与卖家联系，确定转款地址则可以转款，转账时备注订单资金码。在规定交易期限转款后请务必点击「标记已付款」按钮。转款后请不要点击「取消交易」按钮。如果支付时间不足，请重新下单。'},
          {'title': 'Step5：', 'info': '等待卖家放币至您的MIXOTC账户。收到币后交易完成，可对卖家评价。'}
        ],
        buyListSecond: [
          {'title': 'Step1：', 'info': '点开「发广告」，发布购买广告，选择购买的币种，溢价，填写交易的最小/最大限额等信息，最后点击「发布」按钮，广告便会出现在交易中心。'},
          {'title': 'Step2：', 'info': '当有用户下单之后，APP和PC均内会有消息通知。手机登陆用户会发送短信通知，邮箱登陆则会发送邮件通知。'},
          {'title': 'Step3：', 'info': '在规定交易期限中付款给卖家，并点击「标记已付款」按钮，转款后请不要点击「取消交易」按钮。如果支付时间不足，请重新下单。'},
          {'title': 'Step4：', 'info': '等待卖家放币至您的MIXOTC账户，收到币后交易完成，并可对卖家做出评价。'}
        ],
        saleListFirst: [
          {'title': 'Step1：', 'info':'在MIXOTC上使用电话号码或者邮箱注册一个账号。'},
          {'title': 'Step2：', 'info':'在卖出BTC之前，请您先充值BTC至您的MIXOTC账户。'},
          {'title': 'Step3：', 'info':'打开「交易中心」，币种选择BTC，选择出售按钮，通过筛选和排序找到自己想要交易的广告。'},
          {'title': 'Step4：', 'info':'单击「出售BTC」，输入你想出售的人民币数量金额和BTC数量(在可交易量范围内），阅读并同意OTC出售流程规则后勾选小方框，并点击「出售」按钮。'},
          {'title': 'Step5：', 'info':'创建订单后，与买家沟通，等待买家付款，买家付款确认后，您需要仔细检查款项是否已经到账（资金码可分辨该笔资金属于哪个订单）。只有在确认到账之后才可以点击「释放币」按钮，输入支付密码，交易完成，可对买家做出评价。'}
        ],
        saleListSecond: [
          {'title': 'Step1：', 'info':'点开「发广告」，发布购买广告，选择购买的币种，溢价，填写交易的最小/最大限额等信息，最后点击「发布」按钮，广告便会出现在交易中心。'},
          {'title': 'Step2：', 'info':'当买家下单后，您的数字货币将被平台锁定。'},
          {'title': 'Step3：', 'info':'与买家沟通确定收款地址，等待买家付款，仔细检查订单款项（可查看备注资金码分辨）是否已经到账。只有在确认到账之后才可以点击「释放币」按钮，并可对买家做出评价，交易完成。'}
        ],
        serviceList: [
          'MIXOTC运用自己的系统，通过互联网等方式为用户提供数字货币的交易服务。',
          '您有权在本APP浏览数字资产各项产品的实时行情及交易信息、有权通过本APP提交数字资产交易指令并完成数字资产交易。',
          '您有权在本APP查看会员账号信息，有权应用本APP提供的功能进行操作。',
          '您有权按照本APP发布的活动规则参与本APP组织的APP活动。',
          '本APP承诺为您提供的其他服务。'
        ],
        rightList: [
          '用户的用户名、密码和安全性',
          '用户有权修改其账户个人中心、安全设置中各项可修改信息，自行选择录入介绍性文字，自行决定是否提供非必填项的内容',
          '用户有权在MIXOTC浏览比特币的资讯详情以及交易信息并发表符合国家法律规定、MIXOTC社区规则的文章及观点',
          '用户有权根据APP相关规定，获得MIXOTC给与的奖励（如手续费按比例返现等）',
          '用户有权按照MIXOTC发布的活动规则参与MIXOTC组织的各项线上、线下活动（包括各官方平台社区发起的活动）',
          '用户有权查看其MIXOTC账号下的信息',
          '用户有权根据MIXOTC规定，应用MIXOTC提供的功能进行操作、享受MIXOTC提供的其它各类服务'
        ],
        rightListChild: [
          '用户名不可重复注册。用户名一旦注册成功，不可更改。',
          '用户一旦注册成功，成为MIXOTC的用户，将得到用户名和密码，并对以此组用户名和密码登入系统后所发生的所有活动和事件负责，自行承担一切使用该用户名发布的言语、行为等而直接或间接导致的法律责任。',
          '用户有义务妥善保管MIXOTC账号、用户名和密码、短信验证码、谷歌验证码，用户将对用户名和密码、和谷歌密钥安全负全部责任。因用户原因导致用户名或密码、谷歌密钥泄露而造成的任何法律后果由用户本人负责，由于用户自身原因泄露这些信息导致的财产损失，本站不负相关责任。',
          '用户密码遗失的，可以通过注册账户发送的验证码重置密码。用户若发现任何非法使用用户名或存在其他安全漏洞的情况，应立即告知MIXOTC。',
          'MIXOTC不会向任何用户索取密码，不会让用户往任何非本站交易中心里提供的账号、BTC充值地址充值比特币，请大家不要相信任何非MIXOTC官方发布的诈骗信息，往非BTC交易中心提供的账户、地址里充值比特币造成的损失本站不负责任。'
        ],
        dutyList: [
          '不得利用本站危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本站制作、复制和传播煽动信息。',
          '用户不得通过任何手段恶意注册MIXOTC账号，包括但不限于以牟利、炒作、套现等为目的多个账号注册。用户亦不得盗用其他用户账号。 如用户违反上述规定，则MIXOTC有权直接采取一切必要的措施，包括但不限于删除用户发布的内容、取消用户在APP获得的星级、荣誉以及虚拟财富，暂停或查封用户账号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。',
          '禁止用户将MIXOTC以任何形式作为从事各种非法活动的场所、平台或媒介。未经MIXOTC的授权或许可，用户不得借用本站的名义从事任何商业活动，也不得以任何形式将MIXOTC作为从事商业活动的场所、平台或媒介。 如用户违反上述规定，则MIXOTC有权直接采取一切必要的措施，包括但不限于删除用户发布的内容、取消用户在APP获得的星级、荣誉以及虚拟财富，暂停或查封用户账号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。',
          '用户在MIXOTC以各种形式发布的一切信息，均应符合国家法律法规等相关规定及APP相关规定，符合社会公序良俗，并不侵犯任何第三方主体的合法权益，否则用户自行承担因此产生的一切法律后果，且MIXOTC因此受到的损失，有权向用户追偿。'
        ],
        refuseList: [
          'MIXOTC作为“网络服务提供者”的第三方平台，不担保APP平台上的信息及服务能充分满足用户的需求。对于用户在接受MIXOTC的服务过程中可能遇到的错误、侮辱、诽谤、不作为、淫秽、色情或亵渎事件，MIXOTC不承担法律责任。',
          '基于互联网的特殊性，MIXOTC也不担保服务不会受中断，对服务的及时性、安全性都不作担保，不承担非因MIXOTC导致的责任。 MIXOTC力图使用户能对本APP进行安全访问和使用，但MIXOTC不声明也不保证本APP或其服务器是不含病毒或其它潜在有害因素的；因此用户应使用业界公认的软件查杀任何自MIXOTC下载文件中的病毒。',
          '除非MIXOTC以书面形式明确约定，MIXOTC对于用户以任何方式（包括但不限于包含、经由、连接或下载）从本APP所获得的任何内容信息，包括但不限于广告等，不保证其淮确性、完整性、可靠性；对于用户因本APP上的内容信息而购买、获取的任何产品、服务、信息或资料，MIXOTC不承担责任。用户自行承担使用本APP信息内容所导致的风险。',
          'MIXOTC内所有用户所发表的用户评论，仅代表用户个人观点，并不表示本APP赞同其观点或证实其描述，本APP不承担用户评论引发的任何法律责任。',
          'MIXOTC有权删除MIXOTC内各类不符合法律或协议规定的信息，而保留不通知用户的权利。',
          '所有发给用户的通告，MIXOTC都将通过正式的页面公告、站内消息、电子邮件、客服电话、手机短信或常规的信件送达。任何非经MIXOTC正规渠道获得的中奖、优惠等活动或信息，MIXOTC不承担法律责任。',
          'MIXOTC有权根据市场情况调整提现、交易、对冲工具利息等手续费费率，有权决定免费推广期的终止。'
        ],
        aboutList: [
          '本协议是MIXOTC网与用户注册成为MIXOTC用户，使用MIXOTC服务之间的重要法律文件，MIXOTC或者用户的任何其他书面或者口头意思表示与本协议不一致的，均应当以本协议为准。',
          '如果本协议的任何条款被视为不合法、无效或因任何原因而无法执行，则此等规定应视为可分割，不影响任何其它条款的法律效力。',
          '因用户使用MIXOTC而引起或与之相关的一切争议、权利主张或其它事项，均受中华人民共和国法律的管辖。',
          '用户和MIXOTC发生争议的，应首先本着诚信原则通过协商加以解决。如果协商不成，则应向MIXOTC所在地人民法院提起诉讼。',
          '本协议于用户勾选MIXOTC注册页面的网络服务条款并完成注册程序、获得MIXOTC账号和密码时生效，对MIXOTC和用户均具有约束力。'
        ],
        changeList: [
          '用户在接受MIXOTC各项服务的同时，同意接受MIXOTC提供的各类信息服务。用户在此授权MIXOTC可以向其账户、电子邮件、手机等发送商业信息。用户可进入MIXOTC相关页面更改联系方式。',
          'MIXOTC保留随时修改或中断服务而不需通知用户的权利，MIXOTC有权行使修改或中断服务的权利，不需对用户或任何无直接关系的第三方负责。',
          '法律允许范围内，无论在以下何种情况下：信息网络设备维护、信息网络连接故障、电脑、通讯或其他系统的故障、电力故障、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、政府行为、司法行政机关的命令、其他不可抗力或第三方的不作为而造成的服务终止或服务延迟以及用户因此而遭受的损失， MIXOTC不承担责任。',
          '用户对本协议的修改有任何异议或对MIXOTC的服务有任何不满，可以行使以下权利：'
        ],
        changeListChild: [
          '停止使用MIXOTC的网络服务。',
          '通过客服、邮箱等渠道告知MIXOTC停止对其服务。结束服务后，用户使用MIXOTC网络服务条款的权利立即终止。在此情况下，MIXOTC没有义务传送任何未处理的消息或未完成的服务给用户或任何无直接关系的第三方。'
        ],
        stateLinst: [
          {'info': '本"风险与合规声明"应与MIXOTC Technology Company Limited（"MIXOTC"）的"服务条款"（"Services"）一起阅读,简单来说, 我们希望您在我们平台交易时了解重要的风险和合规性问题。'},
          {'title': '声明＃1:【交易有风险】', 'info': '交易或持有数字资产的损失风险可能很大。因此, 您应该根据您的财务状况仔细考虑数字资产或任何杠杆或衍生数字资产的交易是否适合您。'},
          {'title': '声明＃2:【MIXOTC不接受任何法定货币】', 'info': '虽然其他平台可以帮助您充入或提取法定货币, 但MIXOTC不允许也不提供法定货币的结算或提款服务。 MIXOTC仅是一个数字资产交易平台。简单比喻来说，如果您正想听一场重金属音乐会，那请不要错入一场古典音乐会， 否则你可能会头痛地出来。'},
          {'title': '声明＃3:【数字资产不是钱，也不是法定货币】', 'info': '虽然还有其他交易平台可以将数字资产转换或清算为钱或法定货币， 但我们不提供此类服务。 MIXOTC不会将数字资产视为钱或法定货币， 因为数字资产不以任何政府或中央银行为后盾支持。'},
          {'title': '声明＃4:【我们不接受某些客户】', 'info': 'MIXOTC不希望服务于某些客户， 比如来自当地禁止涉及数字资产行为的司法管辖区的客户， 这需要昂贵的跨司法管辖区的监管，或列名在国际制裁清单上的客户。我们根本不想违反各国的规定。'},
          {'title': '声明＃5:【我们可以帮助政府】', 'info': '虽然我们可能不会欢迎昂贵的监管， 但我们尊重法规并遵守所适用的法规。作为良好的企业公民， 我们可能会被执法部门要求提供资料， 并将在法律允许的情况下提供协助。 这意味着我们的平台只欢迎遵守法律的客户。我们欢迎有机会赢得您的业务， 相应的， 我们要求您在我们的平台上合法和正确地行事。'},
        ],
        dataList: [
          'MIXOTC收集， 处理和存储的个人数据， 是通过您使用我们的服务所取得的，或者已经获得了您的同意。这些个人数据可能包括联系方式或与您的设备或互联网服务相关的任何信息（如IP地址和MAC号码）。 MIXOTC使用个人数据与您沟通， 并管理、履行、改进以及为您制定个性化服务。 MIXOTC还可以从我们收集的任何个人数据中生成通用数据， 并将其用于我们自己的目的。',
          '我们还可以使用这些数据与您就MIXOTC或其合作伙伴提供的其他产品或服务进行沟通。除非您同意并在下面列出的详细情况下， 否则我们不会与第三方（与MIXOTC的服务相关的合作伙伴除外）分享您的个人数据。',
          '此外， 我们已采取措施， 防止洗钱、资助恐怖主义、规避贸易和经济制裁的行为， 这要求我们对客户进行尽职调查。这可能包括使用第三方数据和服务提供商将您的个人信息与其数据交叉比对。'
        ],
        dataListChild: [
          '如果我们认为分享对于执行条款（the Terms）是有必要的',
          '使我们能够遵守政府机构， 包括监管机构， 执法部门或司法部门的要求',
          '向为MIXOTC提供服务的第三方（例如管理或技术服务）',
          '如果适用， 出售或转让我们的业务或其任何部分'
        ],
        cookiesList: [
          '当您到访我们APP时, 我们通过cookies使用Google Stats去记录我们的业绩以及核对在线广告的效果。Cookie是发送到您的浏览器上并在您的电脑硬盘驱动器上存储的小量数据。只有当您使用您的电脑进入我们APP时,Cookie才能够被发送到您的电脑硬盘上。',
          'Cookies常用于记录访问者浏览我们APP上的各个项目时的习惯以及偏好。Cookies所搜集的资料是不记名的集体统计数据, 不载有个人资料。',
          'Cookies不能用于取得您的硬盘上的数据、您的电邮地址、及您的私人数据，其可使本APP或服务商系统识别到您的浏览器并捕捉和记忆信息。大多数浏览器都预设为可以接受Cookies。您可以选择将您的浏览器设定为不接受Cookies,或如果Cookies一被装上就通知您。不过, 若设定为禁止Cookies, 您或许便不能启动或使用我们APP的某些功能。'
        ],
        problemList: [
          '如果您对本隐私政策和声明或使用您的个人资料有任何疑问， 请通过发送电子邮件至以下邮箱地址与我们联系（标题为"隐私权请求（PRIVACY REQUEST）"：',
          'support@MIXOTC.com',
          '为了相关数据保护法规， 数据控制人为MIXOTC Technology Company Limited'
        ]
      }
    },
    mounted() {
      if (this.$route.query.source) {
        this.showActive = this.$route.query.source
      }
    },
    beforeRouteUpdate(to, from, next) { // 路由更新获取新的值
      this.showActive = to.query.source;
      next();
    },
    methods: {
      selectTab(index) {
        this.showActive = index
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .rule-wrap
    margin-top 21px
    margin-bottom 30px
    h1
      font-size 12px
      letter-spacing 0.25px
      margin-bottom 20px
    h2
      font-size 24px
      margin-bottom 40px
      letter-spacing 0.27px
    h3
      font-size 17px
      margin-bottom 20px
      color #FFB422
      letter-spacing 0.19px
    h4
      margin-bottom 10px
      font-size 17px
      font-weight bold
      letter-spacing 0.19px
    h5
      font-size 17px
      color #FF794C
      letter-spacing 0.19px
      margin-bottom 5px
    p
      margin-bottom 20px
      letter-spacing 0.16px
      line-height 20px
    .last-p
      margin-bottom 40px

    .title-ul
      width 180px
      margin-right 20px
      text-align center
      float left
      li
        height 60px
        background #FFF
        line-height 60px
        cursor pointer
      li.active
        background #FFF3EB
        border-bottom 2px solid  #FFB422
        /*-moz-box-shadow 0 2px 4px 0 rgba(153,153,153,0.70)
        -webkit-box-shadow 0 2px 4px 0 rgba(153,153,153,0.70)
        box-shadow 0 2px 4px 0 rgba(153,153,153,0.70)
        border-radius 4px*/

    .child-ul
      margin 15px 0 30px 3px
      li
        position relative
        margin-bottom 10px
        padding-left 15px
        letter-spacing 0.16px
        line-height 20px
        &:before
          display inline-block
          position absolute
          top -1px
          left 0
          content '>'
          color $col422

    .content-wrap
      float left
      width 940px
      padding 23px 30px 4px
      background #FFF
      ol
        margin-bottom 40px
        >li
          position relative
          margin-bottom 20px
          padding-left 18px
          &:before
            display inline-block
            position absolute
            top 7px
            left 0
            width 6px
            height 6px
            border-radius 50%
            content ''
            background-color $col422

      .rule-content
        height 624px
        letter-spacing 0.16px

      .rate-wrap
        height 624px
        h3
          margin-bottom 10px
        p
          margin-bottom 10px
        .last-p
          margin-bottom 40px

      .buy-wrap, .sale-wrap, .agreement-wrap, .policy-wrap
        h2
          margin-bottom 20px
        span
          display block
          margin-bottom 50px
          letter-spacing 0.16px
          line-height 20px

      .policy-wrap
        div
          margin-bottom 30px
        b
          display block
          margin 20px 0
        ol
          margin-bottom 30px

</style>
