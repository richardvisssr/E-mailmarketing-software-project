"use client";

import React from "react";

export default function analysePanel(props) {
  return (
    <div className="analysePanel">
      <div className="analysePanel__header">
        <h3 className="analysePanel__header__title">Analyse</h3>
      </div>
      <div className="analysePanel__body">
        <div className="analysePanel__body__content">
          <div className="analysePanel__body__content__item">
            <p className="analysePanel__body__content__item__title">Analyse</p>
            <p className="analysePanel__body__content__item__value">0</p>
          </div>
          <div className="analysePanel__body__content__item">
            <p className="analysePanel__body__content__item__title">Analyse</p>
            <p className="analysePanel__body__content__item__value">0</p>
          </div>
          <div className="analysePanel__body__content__item">
            <p className="analysePanel__body__content__item__title">Analyse</p>
            <p className="analysePanel__body__content__item__value">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
