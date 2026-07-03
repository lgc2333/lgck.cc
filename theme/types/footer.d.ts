export interface FooterConfig {
  /**
   * 建站于
   */
  since: number

  /**
   * Icon between year and copyright info.
   */
  icon: Partial<{
    /**
     * icon name, i-xxx
     */
    enable: boolean
    name: string
    animated: boolean
    color: string
    url: string
    title: string
  }>

  /**
   * Powered by valaxy & valaxy-theme-${name}, default is yun
   */
  powered: boolean

  /**
   * Chinese Users | 中国用户
   * 备案 ICP
   * 国内用户需要在网站页脚展示备案 ICP 号
   * https://beian.miit.gov.cn/
   */
  beian: {
    enable: boolean
    /**
     * 苏ICP备xxxxxxxx号
     */
    icp: string
    /**
     * Custom ICP link.
     * @default 'https://beian.miit.gov.cn/'
     */
    icpLink?: string
    /**
     * 公安网备案号
     */
    police?: string
  }
}
