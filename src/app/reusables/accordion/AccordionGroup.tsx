import { Component } from 'react';
import classNames from 'classnames';
import './AccordionGroup.scss';
import { ACCORDION_ITEM_HEIGHT } from './AccordionItem';
import Icon from '../icon/Icon';

interface AccordionGroupProps {
  header?: string;
  expanded?: boolean;
  showNumber?: boolean;
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
    const { children, header, showNumber } = this.props;
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
          className='accordion-group-header header-font'
          onClick={this.onClick}
        >
          {'' + header + (hasChildren && showNumber ? ` (${numChildren})` : '')}
          <Icon icon='chevron-down' />
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