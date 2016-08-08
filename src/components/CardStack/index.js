/* @flow */

import React, { Component, createElement } from 'react'
import { Platform, NavigationExperimental, View } from 'react-native'
import StyleInterpolator from './../../helpers/StyleInterpolator'
import type { NavigationState, NavigationSceneProps } from './../../types'

const {
  Transitioner: NavigationTransitioner,
  Card: NavigationCard,
} = NavigationExperimental

const {
  CardStackPanResponder,
} = NavigationCard

type Props = {
  navigationState: NavigationState,
  renderScene: (sceneProps: NavigationSceneProps) => React$Element<any>,
  renderOverlay?: (sceneProps: NavigationSceneProps) => React$Element<any> | null,
  pop: () => void,
}

class CardStack extends Component {

  props: Props

  renderScenes = (props: any): React$Element<any> => {
    const { renderOverlay } = this.props
    const scenes = props.scenes.map((scene) => (
      this.renderScene({
        ...props,
        scene,
      })
    ))
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {scenes}
        </View>
        {renderOverlay && createElement(renderOverlay, props)}
      </View>
    )
  }

  renderScene = (props: NavigationSceneProps): React$Element<any> => {
    const style = Platform.OS === 'android' ?
      StyleInterpolator.forAndroid(props) :
      StyleInterpolator.forIOS(props)

    /** @TODO pass StyleInterpolator via props **/

    const panHandlersProps = {
      ...props,
      onNavigateBack: this.props.pop,
    }
    const panHandlers = Platform.OS === 'android'
      ? CardStackPanResponder.forVertical(panHandlersProps)
      : CardStackPanResponder.forHorizontal(panHandlersProps)
    return (
      <NavigationCard
        {...props}
        key={props.scene.key}
        panHandlers={panHandlers}
        renderScene={this.props.renderScene}
        style={style}
      />
    )
  }

  shouldComponentUpdate(nextProps) {
    return this.props.navigationState.index !== nextProps.navigationState.index
  }

  render() {
    return (
      <NavigationTransitioner
        navigationState={this.props.navigationState}
        render={this.renderScenes}
      />
    )
  }

}

export default CardStack
