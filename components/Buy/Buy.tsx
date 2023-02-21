import React, {useCallback, useState} from "react";
import classNames from "classnames";

import blueButtonBack from "../../assets/images/blueButtonBack.svg";
import blueButtonFront from "../../assets/images/blueButtonFront.svg";
import candy from "../../assets/images/candy.png";
import exit from "../../assets/images/exit.svg";
import metaCoinOrange from "../../assets/images/metaCoinOrange.svg";
import metaCoinBlue from "../../assets/images/metaCoinBlue.svg";
import {stores} from "@/stores";
import {observer} from "mobx-react-lite";
import {sockets} from "@game/core/Sockets";
import {MarketPaymentType} from "@/sharedData/enums/MarketPaymentType";

const Buy = () => {
    const [item, setItem] = useState<number>(0);
    const [count, setCount] = useState<number>(1);

    const close = useCallback(() => {
        stores.ui.setRenderInterfaces("hud");
    }, []);

    const changeCount = useCallback((isPlus: boolean) => {
        if (isPlus) {
            if (count === 99) return;

            setCount(count + 1);
        } else {
            if (count === 1) return;

            setCount(count - 1);
        }
    }, [count]);

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
    }, []);

    const changeItem = useCallback((id: number) => {
        setItem(id);
        setCount(1);
    }, []);

    const buy = useCallback((id: number, count: number, paymentType: MarketPaymentType) => {
        sockets.emit("market:buy", stores.market.marketId, id, count, paymentType);
    }, []);

    return <div className="market-body">

        <img src={exit} alt="" className="market-exit" onClick={() => close()}/>

        <div className="market-body-buy-left">
            {
                stores.market.catalog.map((el, key) => {
                    return <div className={classNames("market-body-buy-left-block", {"active": item === key})}
                                onClick={() => changeItem(key)} key={key}>
                        <img src={require(`../../assets/images/items/${el.image}`)}
                             alt="" className="market-body-buy-left-block__image"/>

                        <div className="market-body-buy-left-block-text">
                            <div className="market-body-buy-left-block-text__top">{el.name}</div>
                            <div className="market-body-buy-left-block-text__bottom">{el.group}</div>
                        </div>

                        <div className="market-body-buy-left-block-price">
                            {el.paymentType === MarketPaymentType.DEFAULT_COIN ?
                                <>
                                    <img src={metaCoinOrange} alt=""/>
                                    <span>{el.cost}</span>
                                </> : <>
                                    <img src={metaCoinBlue} alt=""/>
                                    {el.cost}
                                </>
                            }
                        </div>
                    </div>;
                })
            }

        </div>

        {stores.market.catalog[item] && <div className="market-body-sale-right market-body-buy-right">

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
                                <span>{count * stores.market.catalog[item].cost}</span>
                            </> : <>
                                <img src={metaCoinBlue} alt=""/>
                                {count * stores.market.catalog[item].cost}
                            </>
                        }
					</div>
				</div>

				<div className="market-body-sale-right-control-blue-button"
					 onClick={() => buy(stores.market.catalog[item].id, count, stores.market.catalog[item].paymentType)}>
					<div className="market-body-sale-right-control-blue-button-front">
						<img src={blueButtonFront} alt=""/>
						<span>Buy</span>
					</div>
					<img src={blueButtonBack} alt=""/>
				</div>

			</div>

		</div>}

    </div>;
};

export default observer(Buy);