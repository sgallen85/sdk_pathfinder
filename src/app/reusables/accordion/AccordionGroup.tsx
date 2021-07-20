import { Component } from 'react';
import classNames from 'classnames';
import './AccordionGroup.scss';
import { ACCORDION_ITEM_HEIGHT } from './AccordionItem';

interface AccordionGroupProps {
  header?: string;
  expanded?: boolean;
}

interface AccordionGroupState {
  expanded: boolean;
  showChildren: boolean;
}

export default class AccordionGroup extends Component<AccordionGroupProps, AccordionGroupState> {
  constructor(props: any) {
    super(props);
    const { expanded } = this.props;
    this.state = {
      expanded: !!expanded,
      showChildren: !!expanded,
    };
  }

  private onClick = () => {
    const { expanded, showChildren } = this.state;
    this.setState({
      expanded: !expanded,
    }, () => setTimeout(() => this.setState({showChildren: !showChildren}), showChildren ? 250 : 0));
  }
  
  public render() {
    const { children, header } = this.props;
    const { expanded } = this.state;

    let numChildren = 0;
    if (children) {
      if (Array.isArray(children)) {
        numChildren = children.length;
      } else {
        numChildren =  1; // one child fails isArray check
      }
    }
    const hasChildren = numChildren > 0;
    const contentHeight = expanded && hasChildren ? `calc(${numChildren}*${ACCORDION_ITEM_HEIGHT})` : '0';

    return (
      <div className={classNames('accordion-group-container', {'collapsed': !expanded})}>
        <div
          className='accordion-group-header'
          onClick={this.onClick}
        >
          {'' + header + (hasChildren ? ` (${numChildren})` : '')}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="accordion-icon icon-chevron-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
        <div
          className={classNames('accordion-group', {
            'collapsed': !expanded,
          })}
          style={{ height: contentHeight }}
        >
          {numChildren > 0 && children}
        </div>
      </div>
    );
  }
}