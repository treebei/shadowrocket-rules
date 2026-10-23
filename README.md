# shadowrocket-rules

Shadowrocket 自用广告规则。使用 [adblock.sgmodule](https://raw.githubusercontent.com/treebei/shadowrocket-rules/main/adblock.sgmodule)，统一包含域名拦截、路径重写和正文过滤。

## 使用

1. 配置 → 模块 → 添加上面的模块 URL，下载并启用；已有模块请手动更新。
2. 全局路由选择「配置」。在当前正在使用的配置中启用 HTTPS 解密，安装并完全信任自己生成的 Shadowrocket 证书。模块不会自动开启解密或提供证书。
3. 对当前配置执行「使用配置 / 编译配置」，重连 VPN，清理目标 App 的广告缓存并完全退出后再启动。
4. 切换配置后重新检查 HTTPS 解密是否开启；仅更新规则集不会更新模块。

## 覆盖范围

| 产品 | 范围 |
| --- | --- |
| 高德 | 广告/统计域名、开屏请求、路线规划推广、ai_rec 信息流、广告归因、scene 推荐 |
| 淘宝 / 天猫 / 阿里 | 已列出的广告与统计域名 |
| 微信 / 腾讯 | 已列出的广告与统计域名，不保证清除所有朋友圈广告 |
| 菜鸟裹裹 | 商品推广、nbnetflow 广告（保留 URL 含 _home 的接口）、搜索热词、底部角标及部分支付宝小程序广告 |
| Bilibili | 开屏、JSON 推荐流 cm 广告卡片、JSON 搜索结果 _ad 卡片 |

Bilibili 新版 gRPC / Protobuf 推荐流、动态和视频内嵌推广不在本次规则范围。菜鸟、高德将广告与正常业务混合返回的首页卡片，也不能仅靠拒绝整条请求完整净化。

## 失效排查

- 模块 URL 必须以 adblock.sgmodule 结尾。旧模块改名后路径已删除，仍订阅旧地址会更新失败。
- 旧域名规则文件已移除；若配置中仍有指向旧文件的 RULE-SET 引用，请删除并使用上述模块。
- 检查模块是否已更新和启用、全局路由是否为「配置」、当前配置的 HTTPS 解密及证书信任状态。
- 日志中只有域名而没有 HTTPS 路径时，检查是否完成解密。若匹配了其他模块的放行规则，调整模块顺序后重新编译。
- 规则已命中但广告仍在，先清理缓存；新接口需要结合实际请求日志追加。分享日志时删除 Cookie、令牌和个人信息。
- 本仓库已进行静态检查与规则匹配测试，未在实际 iPhone 和当前 App 版本上验证。

## HTTPS 解密与重写测试

模块版本 `2026.10.23.2` 加入 httpbin.org 测试域名。更新并启用模块，重新应用配置、重连 VPN 后，用 Safari 打开：

| 地址 | 正常测试结果 |
| --- | --- |
| https://httpbin.org/anything/sr-mitm-test?t=1 | 跳转至 https://example.com/?shadowrocket_mitm=ok，显示 Example Domain |
| https://httpbin.org/anything/sr-reject-test?t=1 | 返回空 JSON 对象 `{}` |
| https://httpbin.org/get?t=1 | 对照请求，正常返回 httpbin 的 JSON |

每次复测可更改 t 参数以减少缓存影响。测试应在 Safari 中打开，不使用聊天应用的链接预览。
跳转成功可验证该 HTTPS 请求的解密和 URL 重写已生效；空 JSON 可验证 reject-dict。若看到包含 url、headers 等字段的 httpbin 原始 JSON，则相应测试重写未生效；网络错误不能单独证明拦截成功。
未在用户 iPhone 上实测。httpbin.org 是公开测试服务，可用性取决于服务及当前网络。
停用测试可在本地模块中注释两条测试重写规则，并移除 MITM hostname 中的 httpbin.org；远程更新会恢复仓库版本。

## 参考

- 高德：[@ddgksf2013 / AmapAds.conf](https://github.com/ddgksf2013/Rewrite/blob/master/AdBlock/AmapAds.conf)
- 菜鸟：[@ddgksf2013 / CainiaoAds.conf](https://github.com/ddgksf2013/Rewrite/blob/master/AdBlock/CainiaoAds.conf)、[小白脸规则 / NobyDa 转发](https://t.me/NobyDa/1017)
- Bilibili JSON 字段与接口参考：[Maasea / Bilibili Helper](https://github.com/Maasea/sgmodule/blob/master/Script/Bilibili/bilibili.helper.v2.js)；本仓库用 jq 过滤，不加载其远程脚本。
