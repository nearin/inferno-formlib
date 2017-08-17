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

class TextAreaWidget extends Component {
    constructor (props) {
        super(props)

        this.state = {
            value: props.value
        }
        this.didGetInput = this.didGetInput.bind(this)
        this.didGetChange = this.didGetChange.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    didGetInput (e) {
        const field = this.props.adapter.context
        this.setState({
            value: field.fromString(e.target.value)
        })
    }

    didGetChange (e) {
        this.props.onChange(this.props.propName, this.state.value)
    }

    render () {
        const field = this.props.adapter.context

        const cls = {
            "form-control": true,
            "form-control-danger": this.props.validationError
        }

        return <textarea
            id={this.props.namespace.join(".") + "__Field"}
            name={this.props.inputName}
            className={classNames(cls)}
            type="text"
            placeholder={field.placeholder}
            readOnly={field.readOnly}
            value={this.state.value}

            onChange={this.didGetChange}
            onInput={this.didGetInput} />
    }
}

export default TextAreaWidget

createAdapter({
    implements: IInputFieldWidget,
    adapts: interfaces.ITextAreaField,
    Component: TextAreaWidget,
}).registerWith(globalRegistry)
