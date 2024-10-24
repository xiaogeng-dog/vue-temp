import { JSEncrypt } from 'jsencrypt'
import { b64tohex } from 'jsencrypt/lib/lib/jsbn/base64'

/** rsa秘钥对生成网站 http://web.chacuo.net/netrsakeypair */

export class rsa {
  private rsaEncrypt: JSEncrypt = new JSEncrypt()

  /** 公钥 */
  private publicKey: string =
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgUQ6whp6I2PqtPvWZntZFcmmJ21P6LKYpkoHPGKST/oveEkBULp/XvxXWMGInbyGJQ5awJ5wIws8Nkl7yQMDm3aQb49zIFl+Eaf0D+8ADvMVzFY/frbkVpn1wON5tLFxf3Db4yQtveiTUlc3k2r2/dfYTlLhbXlz/pduRDF3pjpV3v7n/2gjVz47B+HdvFOczwyEguOnOYYik3y4BXQ7tPL44enYsbvZRViN9S0JqnDaoxjW85FmdiQeztQgzzesMX+HxY11JxJ/Tbxl7h6NrLGwNI1ZEgc5sQUX8PgTGwfO3zp3WUVcjwHNwwm06lbAryYsVFoSgmdMyhbUw+LkiQIDAQAB'

  /** 私钥 */
  private privateKey: string = ``

  /** 分段最长字符 */
  private maxLength: any = 512

  constructor() {
    this.rsaEncrypt.setPrivateKey(this.privateKey)
    this.rsaEncrypt.setPublicKey(this.publicKey)
  }

  /**
   * 加密
   * @param content
   */
  encrypt(content: string): string | boolean
  encrypt(content: string): string | boolean {
    return this.rsaEncrypt.encrypt(content)
  }

  /**
   * 解密
   * @param content
   */
  decrypt(content: string): string | boolean
  decrypt(content: string): string | boolean {
    return this.rsaEncrypt.decrypt(content)
  }

  longDecrypt(content: string): string | boolean
  longDecrypt(content: string): string | boolean {
    const key = this.rsaEncrypt.getKey()
    let ct: any = ''
    try {
      const hex = b64tohex(content)
      if (hex.length > this.maxLength * 2) {
        const hexArr = hex.match(/.{1,1024}/g)
        ct = hexArr?.map((entry) => key.decrypt(entry)).join('')
      } else {
        ct = key.decrypt(hex)
      }
      if (ct) {
        return ct
      }
      return false
    } catch {
      return false
    }
  }
}
export default new rsa()
