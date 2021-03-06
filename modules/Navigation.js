/* @flow */
/* eslint react/no-children-prop: 0 */

import React from 'react'
import type { NavigationProps, CardSubViewProps } from './TypeDefinitions'
import CardStack from './CardStack'
import DefaultRenderer from './DefaultRenderer'
import NavBar from './NavBar'
import { History } from './HistoryUtils'
import * as StackUtils from './StackUtils'

type Props = NavigationProps & {
  children?: Array<React$Element<any>>,
}

class Navigation extends React.Component<void, Props, void> {
  props: Props

  renderHeader = (
    sceneProps: CardSubViewProps,
    props: CardSubViewProps,
  ): ?React$Element<any> => {
    // Hide nav bar
    if (sceneProps.hideNavBar) return null
    // Render custom nav bar
    if (sceneProps.renderNavBar) {
      return sceneProps.renderNavBar(sceneProps)
    }
    // Else return default <NavBar /> component
    return <NavBar {...props} />
  }

  renderSceneComponent = (sceneProps: CardSubViewProps): ?ReactClass<any> => {
    const { render, children, component } = sceneProps
    if (render) return render
    else if (children && typeof children === 'function') return children
    else if (component) return component
    return null
  }

  render(): React$Element<any> {
    const { children, ...props } = this.props
    return (
      <History>
        {history =>
          <CardStack
            {...props}
            history={history}
            children={children}
            render={ownProps =>
              <DefaultRenderer
                {...props}
                {...ownProps}
                renderSceneComponent={StackUtils.renderSubView(
                  this.renderSceneComponent,
                )}
                renderHeader={StackUtils.renderSubView(this.renderHeader)}
              />}
          />}
      </History>
    )
  }
}

export default Navigation
