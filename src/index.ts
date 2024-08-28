import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
import { ipSearch } from './tools';

const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['demo.ip-api.com']);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      "zh-CN": {
        "ip": "IP 地址",
        "ipLocation": "IP 归属地",
        "isp": "运营商"
      },
      "en-US": {
        "ip": "IP Address",
        "ipLocation": "IP Location",
        "isp": "ISP"
      },
      "ja-JP": {
        "ip": "IPアドレス",
        "ipLocation": "IP所在地",
        "isp": "通信事業者"
      }
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'ip',
      label: t('ip'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
      },
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        {
          key: 'id',
          isGroupByKey: true,
          type: FieldType.Text,
          title: 'id',
          hidden: true,
        },
        {
          key: 'ipLocation',
          type: FieldType.Text,
          title: t('ipLocation'),
          primary: true,
        },
        {
          key: 'isp',
          type: FieldType.Text,
          title: t('isp'),
        },
      ],
    },
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { ip: [{ text: string }] }, context) => {
    const { ip: [{ text = null}] = [{}] } = formItemParams;
    try {

      const result = await ipSearch(text, context.fetch);

      if (!result || result.status !== 'success') {
        return {
          code: FieldCode.Success,
          data: {
            id: `${Math.random()}`,
          }
        }
      }

      return {
        code: FieldCode.Success,
        data: {
          id: `${Math.random()}`,
          ipLocation: [result.country, result.regionName, result.city].join(' '),
          isp: result.isp || ''
        }
      }
    } catch (e) {
      return {
        code: FieldCode.Error,
      }
    }
  },
});
export default basekit;