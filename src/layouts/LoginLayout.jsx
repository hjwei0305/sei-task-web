import React, { PureComponent, Fragment } from "react";
import withRouter from "umi/withRouter";
import { setLocale } from 'umi-plugin-react/locale'
import zhCN from "seid/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";
import { SeidLocaleProvider } from 'seid';

import { userUtils, } from '@/utils';

const { getCurrentLocale, } = userUtils;

const languages = {
  'en-US': zhCN,
  'zh-CN': enUS,
};

@withRouter
class LoginLayout extends PureComponent {

  getLang = () => {
    const locale = getCurrentLocale() || "zh-CN";
    setLocale(locale);
    return locale;
  };

  render() {
    const locale = this.getLang();
    const { children } = this.props;
    return (
      <Fragment>
        <SeidLocaleProvider locale={languages[locale]} antdLocale={locale}>
          {children}
        </SeidLocaleProvider>
      </Fragment>
    );
  }
}

export default LoginLayout;
