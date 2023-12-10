import styles from './uses.module.scss'
import Card from 'components/Card'

const Uses = () => (
  <div className={styles.wrapper}>
    <h1>Uses</h1>
    <p>A rundown of the hardware and software I use on a regular basis</p>
    <Card title="Hardware">
      <h3 className="h4">Computers</h3>
      <dl className={styles.dl}>
        <dt>Personal Laptop</dt>
        <dd>
          <a href="https://frame.work">Framework laptop 13</a>, AMD Ryzen 7
          7840U, 32gb RAM, 2TB SSD
        </dd>
        <dt>Work Laptop</dt>
        <dd>Lenovo T14</dd>
        <dt>Gaming PC</dt>
        <dd>Custom gaming PC (details to come)</dd>
      </dl>
      <h3 className="h4">Misc</h3>
      <dl className={styles.dl}>
        <dt>Phone</dt>
        <dd>
          <a href="https://www.po.co/global/poco-f3/">Poco F3</a> running{' '}
          <a href="https://pixelos.net/">Pixel OS</a>. It's fine. Mostly bought
          for it's good custom ROM support and not finding my ideal phone at the
          time that I bought it.
        </dd>
        <dt>Watch</dt>
        <dd>
          <a href="https://www.samsung.com/us/watches/galaxy-watch6/">
            Samsung Galaxy Watch 6
          </a>
          . Is a lovely - not too large - smart watch, running wear os with my
          custom watchface.
        </dd>
        <dt>Headphones</dt>
        <dd>
          <a href="https://electronics.sony.com/audio/headphones/headband/p/wh1000xm4-b">
            Sony WH-1000XM4
          </a>{' '}
          for at home &{' '}
          <a href="https://www.samsung.com/us/mobile-audio/galaxy-buds2-pro/">
            Galaxy Buds 2 Pro
          </a>{' '}
          on the go.
        </dd>
        {/* <dt>Keyboard</dt>
        <dd>Anne Pro 2 & Custom</dd>
        <dt>Mouse</dt>
        <dd>Surface Mouse, Logitech something?</dd> */}
        <dt>Mobile Gaming</dt>
        <dd>
          <a href="https://www.steamdeck.com/">Steam Deck</a> for console like
          gaming on the couch or bigger trips and{' '}
          <a href="https://retrododo.com/miyoo-mini-v2/">Miyoo Mini v2</a> which
          I love to just have in my bag to play whenever, although the thing is
          unfortunately fragile and I've already replaced the screen in it.
        </dd>
      </dl>
    </Card>

    <Card title="Software">
      <h3 className="h4">Desktop Environment</h3>
      <dl className={styles.dl}>
        <dt>Distro</dt>
        <dd>
          I run <a href="https://archlinux.org/">Arch</a> on my personal laptop,
          mainly for the <a href="https://aur.archlinux.org">AUR</a>.{' '}
          <a href="https://fedoraproject.org/">Fedora</a> on the work laptop for
          support reasons, but it still provides newer packages than other
          distros and Windows 11 on the gaming PC.
        </dd>
        <dt>Desktop Environment</dt>
        <dd>
          <a href="https://hyprland.org/">Hyprland</a> is my current desktop
          environment of choice. I love tiling windows and it's incredibly
          flexible and can be made to look pretty decent compared to a lot of
          other options.{' '}
          <a href="https://github.com/grantcodes/dotfiles">
            Find my dotfiles on GitHub
          </a>
          .
        </dd>
        <dt>Bar / UI</dt>
        <dd>
          I'm trying out <a href="https://github.com/Aylur/ags">AGS</a>, as it's
          mostly based on web technolgies. It's pretty complex to use, but very
          powerful.
        </dd>
        <dt>Launcher</dt>
        <dd>
          I use{' '}
          <a href="https://github.com/adi1090x/rofi">a wayland fork of Rofi</a>{' '}
          as my launcher as it's well supported with lots of useful extensions,
          like{' '}
          <a href="https://github.com/miroslavvidovic/rofi-emoji">
            window switching
          </a>
          , <a href="https://github.com/muhkoenig/rofi-emoji">emoji search</a>,{' '}
          <a href="https://github.com/leonardofaria/rofi-calc">a calculator</a>,{' '}
          <a href="https://github.com/erebe/greenclip">clipboard management</a>{' '}
          and more.
        </dd>
        <dt>OSD Notifier</dt>
        <dd>
          <a href="https://github.com/misterdanb/avizo">Avizo</a>
        </dd>
        <dt>Screenshots</dt>
        <dd>
          <a href="https://sr.ht/~emersion/grim/">Grim</a> to grab the image,{' '}
          <a href="https://github.com/emersion/slurp">slurp</a> to select the
          area on the screen & <a href="">swappy</a> to edit the screenshot.
        </dd>
      </dl>
      <h3 className="h4">Coding</h3>
      <dl className={styles.dl}>
        <dt>Web Browser</dt>
        <dd>
          I've been a long time <a href="https://vivaldi.com/">Vivaldi</a> fan.
          It has an awesome set of power user features which I don't think I can
          live without along with built in ad-blocking and a nice mobile
          version. A few must-have extensions are:
          <ul>
            <li>
              <a href="https://bitwarden.com/">Bitwarden</a> for password
              management
            </li>
            <li>
              <a href="https://www.i-dont-care-about-cookies.eu/">
                I don't care about cookies
              </a>{' '}
              to get rid of one of the worst parts of the web
            </li>
            <li>
              <a href="https://vimium.github.io/">Vimium</a> for vim-like
              keyboard controls
            </li>
            <li>
              <a href="https://github.com/ronen25/imagus">Imagus</a> for
              hovering images
            </li>
            <li>PostrChild for indieweb integration</li>
          </ul>
        </dd>
        <dt>Editor</dt>
        <dd>
          <a href="https://code.visualstudio.com/">VS Code</a> of course. With
          some vital extensions:
          <ul>
            <li>
              <a href="https://marketplace.visualstudio.com/items?itemName=amVim.amVim">
                amVim
              </a>{' '}
              for vim-like keyboard controls
            </li>
            <li>
              <a href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode">
                Prettier
              </a>{' '}
              for code formatting
            </li>
            <li>
              <a href="https://marketplace.visualstudio.com/items?itemName=joelday.docthis">
                VS DocBlockr
              </a>{' '}
              and{' '}
              <a href="https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments">
                Better Comments
              </a>{' '}
              for writing comments
            </li>
            <li>
              <a href="https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens">
                Error Lens
              </a>{' '}
              for inline error messages
            </li>
          </ul>
        </dd>
        <dt>Terminal</dt>
        <dd>
          <a href="https://sw.kovidgoyal.net/kitty/">Kitty</a> as it's modern,
          lightweight and customizable
        </dd>
        <dt>Shell</dt>
        <dd>
          <a href="https://ohmyz.sh/">ZSH</a> &{' '}
          <a href="https://starship.rs/">Starship</a>, I used to use{' '}
          <a href="https://fishshell.com/">fish</a>, but the incompatibilty with
          bash was always a pain.
        </dd>
        <dt>Notes</dt>
        <dd>
          I'm just getting started with{' '}
          <a href="https://obsidian.md/">Obsidian</a> but love that it just ends
          up as a folder of Markdown files
        </dd>

        <dt>Docs</dt>
        <dd>
          <a href="https://zealdocs.org/">Zeal</a>
        </dd>
        <dt>Email Client</dt>
        <dd>
          I quite like{' '}
          <a href="https://www.mozilla.org/en-US/thunderbird/">Thuderbird</a>{' '}
          now after finding it quite ugly for a number of years. But I still
          think I could be tempted to change if there was a better option on
          linux.
        </dd>
      </dl>
      <h3 className="h4">Misc</h3>
      <dl className={styles.dl}>
        <dt>VPN</dt>
        <dd>
          <a href="https://mullvad.net/">Mullvad</a>
        </dd>
        <dt>Password Manager</dt>
        <dd>
          <a href="https://bitwarden.com/">Bitwarden</a> using{' '}
          <a href="https://github.com/dani-garcia/vaultwarden">Vaultwarden</a>{' '}
          to self host the backend.
        </dd>
        <dt>Music</dt>
        <dd>
          <a href="https://www.spotify.com/">Spotify</a>
        </dd>
        <dt>Media Center</dt>
        <dd>
          <a href="https://www.plex.tv/">Plex</a>
        </dd>
        <dt>Home Automation</dt>
        <dt>
          <a href="https://www.home-assistant.io/">Home Assistant</a>
        </dt>
      </dl>
      <h3 className="h4">Mobile Apps</h3>
      <dl className={styles.dl}>
        <dt>Launcher</dt>
        <dd>
          <a href="https://getniagara.com/">Niagara</a> is a great, minimalist
          launcher
        </dd>
        <dt>Maps</dt>
        <dd>
          I find <a href="https://citymapper.com/">Citymapper</a> to be
          infinitely better than{' '}
          <a href="https://www.google.com/maps">Google Maps</a> for public
          transport in big European cities nv
        </dd>
        <dt>Location tracking</dt>
        <dd>
          <a href="https://owntracks.org/">Owntracks</a>
        </dd>
        <dt>Podcasts</dt>
        <dd>
          <a href="https://pocketcasts.com/">Pocket casts</a>
        </dd>
        <dt>Travel planning</dt>
        <dd>
          <a href="https://www.tripit.com/">Tripit</a>
        </dd>
      </dl>
    </Card>
  </div>
)

export const metadata = {
  title: 'Uses',
}

export default Uses
