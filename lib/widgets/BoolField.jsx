'use strict'
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
import Inferno from 'inferno'
import Component from 'inferno-component'

import { createAdapter, globalRegistry } from 'component-registry'

import { interfaces } from 'isomorphic-schema'
import { IInputFieldWidget }  from '../interfaces'
import classNames from 'classnames'

// Placeholder

class CheckboxWidget extends Component {
    constructor (props) {
        super(props)

        this.didGetChange = this.didGetChange.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, e.target.checked)
    }

    render () {
        const field = this.props.adapter.context

        const cls = {
            "form-check-input": true,
            "form-control-danger": this.props.validationError
        }

        return <input
            id={this.props.namespace.join(".") + "__Field"}
            name={this.props.inputName}
            className={classNames(cls)}
            type="checkbox"
            readOnly={field.readOnly}
            value={this.props.value ? 'checked' : undefined}
            onChange={this.didGetChange} />
    }
}

export default CheckboxWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.IBoolField,
    Component: CheckboxWidget
}).registerWith(globalRegistry)
