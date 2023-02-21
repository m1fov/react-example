import React, {useCallback, useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import {observer} from "mobx-react-lite";

import blueButtonBack from "../../assets/images/blueButtonBack.svg";
import blueButtonFront from "../../assets/images/blueButtonFront.svg";
import exit from "../../assets/images/exit.svg";
import metaCoin from "../../assets/images/metaCoin.svg";
import metaCoinOrange from "../../assets/images/metaCoinOrange.svg";
import metaCoinBlue from "../../assets/images/metaCoinBlue.svg";
import orangeButtonBack from "../../assets/images/orangeButtonBack.svg";
import orangeButtonFront from "../../assets/images/orangeButtonFront.svg";

import {stores} from "@/stores";
import {sockets} from "@game/core/Sockets";
import {MarketPaymentType} from "@/sharedData/enums/MarketPaymentType";

const Sale = () => {
    const close = useCallback(() => {
        stores.ui.setRenderInterfaces("hud");
    }, []);

    const [item, setItem] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const changeItem = useCallback((id: number) => {
        setItem(id);
        setCount(0);
    }, []);

    const inputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        const value = Math.round(Number(e.target.value));

        if (isNaN(value) || value < 0) return;

        if (value > 99) {
            setCount(99);
            return;
        }

        if (value < 1) {
            setCount(1);
            return;
        }

        setCount(value);
    },[]);

    const changeCount = useCallback((isPlus: boolean) => {
        if (isPlus) {
            if (count === stores.game.getAmountOfItem(stores.market.catalog[item].id)) return;

            setCount(count + 1);
        } else {
            if (count === 0) return;

            setCount(count - 1);
        }
    }, [count, item]);

    const sell = useCallback((id: number, count: number, paymentType: MarketPaymentType) => {
        sockets.emit("market:sell", stores.market.marketId, id, count, paymentType);
    }, []);


    return <div className="market-body">

        <img src={exit} alt="" className="market-exit" onClick={() => close()}/>

        <div className="market-body-sale-left">
            <div className="market-body-sale-left-scroll">

                {
                    stores.market.catalog.map((el, key) => {
                        return <div className={classNames("market-body-sale-left-item", {"active": item === key})}
                                    key={key} onClick={() => changeItem(key)}>
                            <img src={require(`../../assets/images/items/${el.image}`)}
                                 className="market-body-sale-left-item__image" alt=""/>

                            <div className="market-body-sale-left-item-text">
                                <div className="market-body-sale-left-item-text__title">{el.name}</div>
                                <div className="market-body-sale-left-item-text__text">{el.group}</div>
                            </div>
                            <div className="market-body-sale-left-item-price">
                                <div className="market-body-sale-left-item-price-top">
                                    {el.paymentType === MarketPaymentType.DEFAULT_COIN ?
                                        <img src={metaCoinOrange} alt=""/>
                                        :
                                        <img src={metaCoinBlue} alt=""/>
                                    }
                                    {el.cost}
                                </div>
                                <div className="market-body-sale-left-item-price-bottom">
                                    x{stores.game.getAmountOfItem(el.id)}
                                </div>
                            </div>
                            <hr/>
                        </div>;
                    })
                }

            </div>
        </div>

        {stores.market.catalog[item] && <div className="market-body-sale-right">

            <div className="market-body-sale-right__image">
                <img src={require(`../../assets/images/items/${stores.market.catalog[item].image}`)} alt=""/>
            </div>

            <div className="market-body-sale-right-name">
                <div className="market-body-sale-right-name-left">
                    <div className="market-body-sale-right-name-left__top">
                        {stores.market.catalog[item].name}
                    </div>
                    <div className="market-body-sale-right-name-left__bottom">
                        {stores.market.catalog[item].group}
                    </div>
                </div>
                <div className="market-body-sale-right-name-right">
                    <div className="market-body-sale-right-name-right-block">
                        <span>Price</span>
                        <p>
                            {stores.market.catalog[item].paymentType === MarketPaymentType.DEFAULT_COIN ?
                                <>
                                    <img src={metaCoinOrange} alt=""/>
                                    <div>{stores.market.catalog[item].cost}</div>
                                </> : <>
                                    <img src={metaCoinBlue} alt=""/>
                                    {stores.market.catalog[item].cost}
                                </>
                            }
                        </p>
                    </div>
                    <div className="market-body-sale-right-name-right-block">
                        <span>Quantity</span>
                        <p style={{transform: "translateY(-.09vw)"}}>
                            x{stores.game.getAmountOfItem(stores.market.catalog[item].id)}
                        </p>
                    </div>
                </div>
            </div>

            <hr/>

            <div className="market-body-sale-right-control">

                <div className="market-body-sale-right-control-value">
                    <div onClick={() => changeCount(false)}>-</div>
                    <input type="number" value={count} onChange={e => inputChange(e)}/>
                    <div onClick={() => changeCount(true)}>+</div>
                </div>

                <div className="market-body-sale-right-control-price">
                    <div className="market-body-sale-right-control-price-top">Total cost</div>
                    <div className="market-body-sale-right-control-price-bottom">
                        {stores.market.catalog[item].paymentType === MarketPaymentType.DEFAULT_COIN ?
                            <>
                                <img src={metaCoinOrange} alt=""/>
                                <span>{stores.market.catalog[item].cost * count}</span>
                            </> : <>
                                <img src={metaCoinBlue} alt=""/>
                                {stores.market.catalog[item].cost * count}
                            </>
                        }

                    </div>
                </div>

                <div className="market-body-sale-right-control-orange-button" onClick={() => sell(
                    stores.market.catalog[item].id,
                    count,
                    stores.market.catalog[item].paymentType
                )}>
                    <div className="market-body-sale-right-control-orange-button-front">
                        <img src={orangeButtonFront} alt=""/>
                        <span>Sell x{count}</span>
                    </div>
                    <img src={orangeButtonBack} alt=""/>
                </div>

                <div className="market-body-sale-right-control-blue-button"
                     onClick={() => sell(stores.market.catalog[item].id, stores.game.getAmountOfItem(stores.market.catalog[item].id), stores.market.catalog[item].paymentType)}>
                    <div className="market-body-sale-right-control-blue-button-front">
                        <img src={blueButtonFront} alt=""/>
                        <span>Sell all</span>
                    </div>
                    <img src={blueButtonBack} alt=""/>
                </div>

            </div>

        </div>}

    </div>;
};

export default observer(Sale);