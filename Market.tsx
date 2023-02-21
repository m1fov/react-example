import React, {useEffect, useState} from "react";

import "./assets/styles/style.less";

import background from "./assets/images/background.svg";
import coin from "./assets/images/coin.png";
import plus from "./assets/images/plus.svg";
import Buy from "./components/Buy/Buy";
import Sale from "./components/Sale";
import {stores} from "@/stores";
import {observer} from "mobx-react-lite";
import {audio} from "@game/modules/AudioManager";
import classNames from "classnames";

const Market = () => {
    useEffect(() => {
        audio.play("market_open");
    }, []);

    return <div className={classNames("market", {"market-mobile": stores.ui.mobile})}>

        <img src={background} alt="" className="market__background"/>

        <div className="market-panel">
            <div className="market-panel-left">{stores.market.name}</div>
            <div className="market-panel-right">
                <span>[Your balance]</span>
                <img src={coin} alt=""/>
                {stores.game.coins}
                <img src={plus} className="market-panel-right__plus" alt=""
                onClick={() => stores.ui.setRenderInterfaces("wallets")}/>
            </div>
        </div>

        {!stores.market.openTypeIsSell && <Buy/>}
        {stores.market.openTypeIsSell && <Sale/>}

    </div>;
};

export default observer(Market);