import { Component } from 'react';
import './AccordionItem.scss';

interface AccordionItemProps {
  header?: string;
  body?: string;
  onClick?: (e: any) => void;
}

export const ACCORDION_ITEM_HEIGHT = '40px';

export default class AccordionItem extends Component<AccordionItemProps> {
  public render() {
    const { header, body, onClick } = this.props;
    return (
      <div className='accordion-item' onClick={onClick} style={{ height: ACCORDION_ITEM_HEIGHT }}>
        <div className='accordion-item-details'>
          <div className='accordion-item-header'>{header}</div>
          <div className='accordion-item-body'>{body}</div>
        </div>
      </div>
    );
  }
}