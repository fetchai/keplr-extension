import React from 'react';
import style from './style.module.scss';

interface Props {
  title: string;
  image: string;
  onClick: () => void;
}

export const WalletActionsButton = ({ title, image, onClick }:Props) => {
  return (
    <button  className={style['action']} onClick={onClick}>
      <img src={image} alt="" />
      <div className={style['img-title']}>{title}</div>
    </button>
  );
};
