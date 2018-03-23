<template>
  <div>
    <ul>
      <li v-for="index of 104 " :key="index">
        <img :src="require(`@/assets/ee_${iconNumber(index)}.png`)" @click="setCurExpression(`ee_${iconNumber(index)}`)"
             alt="">
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['showExpression'],
    data() {
      return {
        curexpression: '',
        expression: {
          ee_001: '[/:^_^]',
          ee_002: '[/:^$^]',
          ee_003: '[/:Q]',
          ee_004: '[/:815]',
          ee_005: '[/:809]',
          ee_006: '[/:^O^]',
          ee_007: '[/:081]',
          ee_008: '[/:087]',
          ee_009: '[/:086]',
          ee_010: '[/:H]',
          ee_011: '[/:012]',
          ee_012: '[/:806]',
          ee_013: '[/:b]',
          ee_014: '[/:^x^]',
          ee_015: '[/:814]',
          ee_016: '[/:^W^]',
          ee_017: '[/:080]',
          ee_018: '[/:066]',
          ee_019: '[/:807]',
          ee_020: '[/:805]',
          ee_021: '[/:071]',
          ee_022: '[/:072]',
          ee_023: '[/:065]',
          ee_024: '[/:804]',
          ee_025: '[/:813]',
          ee_026: '[/:818]',
          ee_027: '[/:015]',
          ee_028: '[/:084]',
          ee_029: '[/:801]',
          ee_030: '[/:811]',
          ee_031: '[/:?]',
          ee_032: '[/:077]',
          ee_033: '[/:083]',
          ee_034: '[/:817]',
          ee_035: '[/:!]',
          ee_036: '[/:068]',
          ee_037: '[/:079]',
          ee_038: '[/:028]',
          ee_039: '[/:026]',
          ee_040: '[/:007]',
          ee_041: '[/:816]',
          ee_042: '[/:\'""]',
          ee_043: '[/:802]',
          ee_044: '[/:027]',
          ee_045: '[/:(Zz...)]',
          ee_046: '[/:*&*]',
          ee_047: '[/:810]',
          ee_048: '[/:>_<]',
          ee_049: '[/:018]',
          ee_050: '[/:>O<]',
          ee_051: '[/:020]',
          ee_052: '[/:044]',
          ee_053: '[/:819]',
          ee_054: '[/:085]',
          ee_055: '[/:812]',
          ee_056: '[/:"]',
          ee_057: '[/:>M<]',
          ee_058: '[/:>@<]',
          ee_059: '[/:076]',
          ee_060: '[/:069]',
          ee_061: '[/:O]',
          ee_062: '[/:067]',
          ee_063: '[/:043]',
          ee_064: '[/:P]',
          ee_065: '[/:808]',
          ee_066: '[/:>W<]',
          ee_067: '[/:073]',
          ee_068: '[/:008]',
          ee_069: '[/:803]',
          ee_070: '[/:074]',
          ee_071: '[/:O=O]',
          ee_072: '[/:036]',
          ee_073: '[/:039]',
          ee_074: '[/:045]',
          ee_075: '[/:046]',
          ee_076: '[/:048]',
          ee_077: '[/:047]',
          ee_078: '[/:girl]',
          ee_079: '[/:man]',
          ee_080: '[/:052]',
          ee_081: '[/:(OK)]',
          ee_082: '[/:8*8]',
          ee_083: '[/:)-(]',
          ee_084: '[/:lip]',
          ee_085: '[/:-F]',
          ee_086: '[/:-W]',
          ee_087: '[/:Y]',
          ee_088: '[/:qp]',
          ee_089: '[/:$]',
          ee_090: '[/:%]',
          ee_091: '[/:(&)]',
          ee_092: '[/:@]',
          ee_093: '[/:~B]',
          ee_094: '[/:U*U]',
          ee_095: '[/:clock]',
          ee_096: '[/:R]',
          ee_097: '[/:C]',
          ee_098: '[/:plane]',
          ee_099: '[/:alipay]',
          ee_100: '[/:wechat]',
          ee_101: '[/:card]',
          ee_102: '[/:red]',
          ee_103: '[/:trans]',
          ee_104: '[/:secured]'
        }
      };
    },
    methods: {
      iconNumber(num) {
        if (num < 10) {
          return "00" + num;
        } else if (num < 100) {
          return "0" + num;
        } else {
          return num;
        }
      },
      setCurExpression(k) {
        this.$emit('update:showExpression', false);
        this.$emit('express', {express: this.expression[k]})
      }
    }
  };
</script>

<<<<<<< HEAD
<style scoped lang='stylus'>
ul
  overflow hidden
  width 416px
  border 1px solid
  background-color seashell
  li 
    box-sizing border-box
    float left
    width 16px
    height 16px
    &:hover
      border 1px solid #CCC
    img
      width 16px
      height 16px
</style>
=======
<style scoped lang="stylus">
  ul
    width 416px
    overflow hidden
    border 1px solid
    background-color seashell

    li
      width 16px
      height: 16px
      box-sizing border-box
      float left

      &:hover
        border 1px solid #ccc

      img
        width 16px
        height 16px

</style>
>>>>>>> upstream/zcx/otcpc
