const puppeteerExtra = require( "puppeteer-extra" );
const pluginStealth = require( "puppeteer-extra-plugin-stealth" );
const fs = require( "fs" );
class PuppeteerService {
  constructor () {
    this.browser = null;
    this.page = null;
    this.headless = false;
  }

  async initiate( countsLimitsData, isLinkCrawlTest ) {
    this.pageOptions = {
      waitUntil: "networkidle2",
      timeout: 0,
    };
    puppeteerExtra.use( pluginStealth() );

    this.browser = await puppeteerExtra.launch( {
      headless: this.headless,
      ignoreDefaultArgs: [ "--enable-automation" ],
      args: [
        "--start-maximized",
        "--disable-web-security",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        "--isolate-origins",
        "--site-isolation-trial-opt-out",
      ],
    } );

    this.page = await this.browser.newPage();

    await this.page.setDefaultNavigationTimeout(0);
  }

  async inject() {
    const context = await this.browser.createIncognitoBrowserContext();
    this.page = await context.newPage();
    await this.page.setRequestInterception( true );

    this.page.on( "request", ( request ) => {
      //https://static.cdnpub.info/traderoom/glengine_wasm3eca1656.js?v=1642085171"
      // "https://static.cdnpub.info/traderoom/glengine3eca1656.js?v=1642085171"
      
        //"https://static.cdnpub.info/traderoom/glengine467cc14a.js?v=1643979109"
      if (
        request.url().includes("https://static.cdnpub.info/traderoom/glengine") && request.url().includes(".js")
      ) {
        
      console.log(request.url());
        request.respond( {
          status: 200,
          contentType: "application/javascript; charset=utf-8",
          body: fs.readFileSync( "template.js", "utf-8" ),
        } );
        return;
      }
      request.continue();
    } );
    await this.page.goto( "https://iqoption.com/traderoom/" );
  }

  close() {
    if ( this.browser ) {
      this.browser.close();
    }
  }
}
module.exports = PuppeteerService;
