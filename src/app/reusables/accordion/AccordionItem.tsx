import classNames from 'classnames';
import { Component } from 'react';
import './AccordionItem.scss';

interface AccordionItemProps {
  header?: string;
  body?: string;
  selected?: boolean;
  onClick?: (e: any) => void;
}

export const ACCORDION_ITEM_HEIGHT = '40px';

export default class AccordionItem extends Component<AccordionItemProps> {
  public render() {
    const { header, body, selected, onClick } = this.props;
    return (
      <div
        className={classNames('accordion-item', {'selected': !!selected})}
        onClick={onClick}
        style={{ height: ACCORDION_ITEM_HEIGHT }}
      >
        <div className='accordion-item-details'>
          <div className='accordion-item-header'>{header}</div>
          <div className='accordion-item-body'>{body}</div>
        </div>
      </div>
    );
  }
}