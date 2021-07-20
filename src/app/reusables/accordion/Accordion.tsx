import { Component } from 'react';
import './Accordion.scss';

interface AccordionProps {
  header?: string
}

export default class Accordion extends Component<AccordionProps> {

  public render() {
    const { header, children } = this.props;

    return (
      <div className='accordion'>
        { header &&
          <div className='accordion-header'>{header}</div>
        }
        {children}
      </div>
    );
  }
}