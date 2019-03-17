import "../styles/BottomBar.scss";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons";

class BottomBar extends Component {
  elRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    };
  }

  componentDidMount() {
    let el = this.elRef.current;

    let totalH = el.clientHeight;
    let visibleH = el.getElementsByClassName("action-bar")[0].offsetHeight;

    this._closedHeight = totalH - visibleH;
    el.style.bottom = `-${this._closedHeight}px`;
    el.style.transition = "transform 0.3s";
  }

  render() {
    return (
      <section ref={this.elRef} className="bottom-bar">
        <aside className="action-bar">
          <div className="expansion-icons" onClick={this.toggleBar}>
            <FontAwesomeIcon
              icon={faQuestion}
              size="3x"
              fixedWidth
              className="icon icon-default"
            />
            {/* <FontAwesomeIcon
              icon={faTimes}
              size="3x"
              fixedWidth
              className="icon icon-exanded"
            /> */}
          </div>
        </aside>
        <div className="bar-content">
          {/*this.props.children*/}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia,
          accusamus sequi iste dolores iure placeat enim fugiat dolorum,
          reiciendis possimus maxime dignissimos labore amet optio voluptates
          nisi voluptatum asperiores, quidem doloribus. Quo, eveniet. Numquam
          obcaecati minus unde est recusandae, eum error a repellat nisi quos
          quo ut aspernatur amet minima vero voluptas. Facere non qui, dolorem
          odit consequuntur nam maxime eligendi, sit corrupti excepturi quasi
          necessitatibus similique ea magnam ex ducimus! Ea, unde distinctio.
          Quaerat asperiores, possimus ut pariatur a, atque ratione repudiandae
          quia expedita ab quasi in vitae, mollitia beatae incidunt cum ea!
          Laudantium asperiores nisi, sint molestiae dolorum est modi.
          Consectetur laudantium eaque corrupti doloremque placeat quisquam
          animi laboriosam aspernatur sit amet itaque, quaerat obcaecati fugit
          eum quas eligendi, non porro vero, ab asperiores? Harum quod
          distinctio perferendis repellat voluptatibus id neque earum quae in
          nisi! Qui consectetur sed ut totam laudantium adipisci. Fuga
          exercitationem sunt nihil nam. Possimus laudantium facilis dicta
          repudiandae nemo in maxime at, blanditiis consequatur facere,
          voluptatibus velit totam consectetur et fugit quidem aperiam. Deserunt
          enim odit corrupti quibusdam iusto? Nemo quos eaque numquam eius. Ad,
          illo ea suscipit facere tenetur, voluptas quia tempora quas atque
          consequuntur fugit numquam voluptatum. A aut nisi ducimus quod
          eligendi unde pariatur dicta itaque sed deleniti voluptates vel
          cumque, illum dolores tenetur nobis laudantium nam veniam laborum rem
          necessitatibus excepturi neque aliquam. At rem adipisci debitis
          voluptates temporibus quae nulla quod earum sint est culpa deleniti,
          unde hic magnam provident eaque modi recusandae repudiandae.
          Voluptates placeat maxime ea rem doloremque numquam, similique
          repudiandae quod officiis autem libero accusantium recusandae ipsam
          tenetur architecto totam ex dicta sit laudantium. Impedit consequuntur
          optio itaque dolorem culpa hic eveniet quis dolorum repellendus
          laudantium, alias amet harum, vel labore esse ad similique non
          aspernatur, quidem error facere inventore. Similique eius saepe
          blanditiis. Harum, eum culpa! Dolores eveniet ducimus explicabo
          deserunt sunt sapiente mollitia reiciendis aperiam quo quasi placeat,
          fugit quod aliquam delectus voluptatibus ut eius, iusto doloremque
          amet harum pariatur? Ex quidem et quod obcaecati nam ea odio tempore
          tenetur id totam, quaerat incidunt amet culpa, officiis hic
          reprehenderit porro autem architecto earum, magni ut. Eum quia
          deleniti totam recusandae unde, reprehenderit hic fuga nemo excepturi
          incidunt maiores nulla placeat facilis molestiae dicta itaque voluptas
          odit sed mollitia minima error earum? Inventore enim obcaecati ab
          impedit, corrupti voluptates a. Nulla quasi, aspernatur quos assumenda
          rerum deleniti quidem id impedit necessitatibus maiores ipsam corporis
          facilis neque quis sequi eos libero quod ullam. Maiores veritatis
          placeat inventore repellat facere nobis? Error cupiditate doloremque
          eaque pariatur iusto recusandae exercitationem unde ducimus neque
          quaerat, id odit explicabo est doloribus eligendi provident dicta? Hic
          eum quisquam sit officia fugiat? Voluptate omnis dolores perferendis
          officia velit, eos molestiae facilis. Voluptatibus asperiores optio
          praesentium nam eligendi? Nihil, magni tempora. Consequuntur ab quasi
          quaerat explicabo enim saepe vero eveniet id placeat velit quo vitae
          voluptate ea, necessitatibus perferendis veritatis libero impedit,
          quos modi nam! Obcaecati, in ad. Alias aperiam architecto eos officiis
          illum saepe in recusandae dignissimos laborum illo quos qui minus,
          dicta veritatis ad impedit magni magnam dolorem a amet asperiores sunt
          debitis repudiandae iure. Laborum magni, id harum provident omnis
          alias incidunt architecto reiciendis fuga sint illum dignissimos.
          Molestiae incidunt voluptate quo vero consequuntur. Illum, neque odit
          tempora sequi alias ea exercitationem laborum explicabo optio dolore
          voluptas, nesciunt quas laudantium iusto aut asperiores aliquid
          maiores quidem eaque! Impedit explicabo repellendus facere? Quos
          impedit, nam possimus eos voluptas temporibus eaque quidem culpa
          debitis! Fuga enim eveniet odit tempore nemo magnam ut odio laudantium
          adipisci voluptatibus modi obcaecati ab, incidunt corporis. Officiis
          delectus laudantium quisquam sint unde optio, minima consequatur sequi
          odio distinctio corporis quam impedit voluptates tenetur autem,
          ducimus quod eaque modi beatae placeat doloremque mollitia iusto quos.
          Id, dolorem est perspiciatis ratione doloremque magnam quis autem ea
          temporibus commodi illo impedit deleniti vero non quam ipsum.
          Laboriosam numquam quisquam eum culpa reprehenderit eligendi, harum
          architecto repellat temporibus illum, repudiandae incidunt rerum ab,
          facilis sapiente atque consectetur ullam blanditiis molestias! Nihil
          quo, ex enim a placeat excepturi alias veniam modi dignissimos quam
          odio eos consectetur amet culpa doloribus, fugiat delectus
          exercitationem mollitia ipsa voluptatum odit obcaecati, necessitatibus
          libero! Facere illo deleniti perspiciatis quasi delectus numquam
          veniam, expedita totam. Earum similique ipsa ea inventore quos
          corrupti atque dolor incidunt quae eius vel fuga sit accusamus nobis,
          iure accusantium fugit error officiis autem dolore vero! Mollitia
          culpa distinctio, quam excepturi odio cum veniam voluptate tempore eum
          ipsa totam est consectetur pariatur aperiam. Quis odit optio neque
          magni similique sint aspernatur fugiat, reprehenderit dolorem harum
          vero nemo itaque expedita illum! Illum officiis vel ipsam repellat
          corrupti accusantium. Asperiores quis temporibus nisi saepe, iusto
          reiciendis earum quam quo tempora a commodi repellat eius aperiam
          voluptates provident. Illum molestias autem blanditiis accusantium
          doloremque assumenda ipsam minima, provident ut soluta quisquam nulla
          repellendus corporis aspernatur atque minus. Sequi quasi aliquam,
          consectetur libero voluptate repellendus porro fugiat voluptatibus
          iste in, voluptates vel possimus. Ipsam minus quam, consequatur omnis,
          in vel explicabo distinctio veritatis laborum tempora perspiciatis
          rerum tenetur debitis. Consectetur facilis laborum cum cumque sunt
          possimus quos. Neque soluta vel iure deserunt ea maxime ex quam totam,
          tenetur, in, minus dolorem. Nostrum, atque ab unde distinctio, velit,
          odit dolore mollitia iste natus similique cumque a? Sequi cupiditate
          voluptate autem ut iusto, inventore temporibus hic optio dolores
          aliquam pariatur animi non, rerum itaque accusamus voluptatibus iure
          maxime est odit. Explicabo corporis modi, dolore iure nisi repellat
          rem cumque quo natus soluta deleniti laboriosam error sapiente
          delectus molestias maxime, amet quam harum commodi eligendi quas
          quisquam dolorem! Nisi reiciendis quod minus fugit doloribus facilis
          laudantium quas perspiciatis aliquam possimus ipsam est, placeat quos
          suscipit soluta exercitationem ad, eligendi labore similique eum
          officiis qui voluptas. Ad voluptatibus nihil libero minima nesciunt,
          velit, esse alias quam natus obcaecati dolore voluptate sint aperiam
          beatae quod cum doloribus, amet vero. Fuga sed accusantium at nemo ut,
          dolorum reiciendis adipisci placeat illum assumenda dolor ratione
          voluptatum veniam debitis dolorem quaerat deserunt? Dolorem fuga
          corporis, saepe eius modi vel blanditiis ea iure itaque, aperiam cum?
        </div>
      </section>
    );
  }

  toggleBar = () => {
    const { isExpanded } = this.state;
    if (isExpanded) {
      this._setInitialHeight();
    } else {
      this._setOpenedHeight();
    }
    this.setState({ isExpanded: !isExpanded });
  };

  _setInitialHeight() {
    this.elRef.current.style.transform = `translateY(0px)`;
  }

  _setOpenedHeight() {
    this.elRef.current.style.transform = `translateY(-${this._closedHeight}px)`;
  }
}

export default BottomBar;
