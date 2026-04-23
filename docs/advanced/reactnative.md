# React Native 深入指南

## 核心概念与原理

### 1. React Native 是什么？它和 Web 开发有什么不同？

React Native 是 Facebook 开发的跨平台移动应用框架，使用 JavaScript 和 React 构建原生 iOS 和 Android 应用。

**核心区别：**

| 方面     | Web 开发         | React Native                 |
| -------- | ---------------- | ---------------------------- |
| 渲染目标 | DOM 浏览器       | 原生组件                     |
| 线程模型 | 单线程（主线程） | 多线程（JS 线程 + 原生线程） |
| 更新方式 | DOM diff         | Bridge 通信                  |
| 布局引擎 | CSS              | Flexbox（Yoga）              |
| 动画     | CSS Animations   | Animated API / Reanimated    |
| 调试     | Chrome DevTools  | Flipper / CLI                |

### 2. React Native 架构演进

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Native 架构                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Old Architecture (Bridge)                                     │
│   ┌─────────────┐     JSON      ┌─────────────┐                 │
│   │   JS Bundle │ ◄───────────► │   Bridge    │                 │
│   └─────────────┘               └──────┬──────┘                 │
│                                       │                          │
│                                       ▼                          │
│                               ┌─────────────┐                    │
│                               │   Native    │                    │
│                               │   Modules   │                    │
│                               └─────────────┘                    │
│                                                                 │
│   New Architecture (Fabric / TurboModules)                      │
│   ┌─────────────┐               ┌─────────────┐                 │
│   │   JS Bundle │ ───JSI──────► │   Native    │                 │
│   └─────────────┘               │   Modules   │                 │
│                                   └─────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 核心组件

### 3. 常用基础组件

```tsx
// View - 相当于 div
import { View, Text, Image, ScrollView, TextInput } from "react-native";

function MyComponent() {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Hello RN</Text>
                <Image source={{ uri: "https://example.com/image.png" }} style={styles.image} resizeMode="cover" />
                <TextInput
                    style={styles.input}
                    placeholder="Enter text"
                    value={text}
                    onChangeText={setText}
                    keyboardType="email-address"
                    secureTextEntry={false}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginTop: 16,
    },
});
```

### 4. 列表组件

```tsx
import { FlatList, SectionList, VirtualizedList } from "react-native";

// FlatList - 简单列表
function FlatListExample() {
    const data = [
        { id: "1", name: "Apple" },
        { id: "2", name: "Banana" },
    ];

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text>{item.name}</Text>
                </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={<Text>Header</Text>}
            ListFooterComponent={<Text>Footer</Text>}
            refreshing={refreshing}
            onRefresh={() => handleRefresh()}
            onEndReached={() => handleLoadMore()}
            onEndReachedThreshold={0.5}
        />
    );
}

// SectionList - 分组列表
function SectionListExample() {
    const sections = [
        { title: "Fruits", data: ["Apple", "Banana"] },
        { title: "Vegetables", data: ["Carrot", "Potato"] },
    ];

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Text>{item}</Text>}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        />
    );
}
```

### 5. Touchable 系列组件

```tsx
import { TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Pressable } from 'react-native';

// TouchableOpacity - 按下时降低透明度
<TouchableOpacity
  onPress={() => handlePress()}
  onLongPress={() => handleLongPress()}
  activeOpacity={0.7}
  disabled={false}
>
  <Text>Click me</Text>
</TouchableOpacity>

// Pressable - 更现代的方式（推荐）
<Pressable
  onPress={() => console.log('pressed')}
  onLongPress={() => console.log('long pressed')}
  onPressIn={() => console.log('press in')}
  onPressOut={() => console.log('press out')}
  delayLongPress={500}
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed
  ]}
>
  <Text>Press me</Text>
</Pressable>
```

## 样式系统

### 6. 样式使用详解

```tsx
import { StyleSheet, Platform, Dimensions } from "react-native";

// 基础样式
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: Platform.OS === "ios" ? 20 : 16,
        margin: 10,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: Platform.OS === "android" ? 4 : 0,
    },
});

// 条件样式
function ConditionalStyle({ isActive }) {
    return (
        <View style={[styles.base, isActive && styles.active]}>
            <Text>Content</Text>
        </View>
    );
}

// 响应式设计
const { width, height } = Dimensions.get("window");

const responsiveStyles = StyleSheet.create({
    container: {
        width: width > 600 ? "60%" : "90%",
        height: height * 0.5,
    },
});
```

### 7. Flexbox 布局

```tsx
// Flexbox 在 React Native 中的使用
function FlexLayout() {
    return (
        <View style={styles.flexContainer}>
            {/* 主轴方向：column（默认） */}
            <View style={styles.flexItem}>
                <Text>Item 1</Text>
            </View>

            {/* justifyContent - 主轴对齐 */}
            <View style={styles.row}>
                {/* flex-start | center | flex-end | space-between | space-around | space-evenly */}
            </View>

            {/* alignItems - 交叉轴对齐 */}
            <View style={styles.crossAxis}>{/* flex-start | center | flex-end | stretch | baseline */}</View>

            {/* flex 属性 */}
            <View style={styles.grow}>{/* flexGrow | flexShrink | flexBasis */}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    crossAxis: {
        alignItems: "center",
    },
    grow: {
        flex: 1,
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: "auto",
    },
});
```

## 导航系统

### 8. React Navigation 使用

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Stack Navigator
const Stack = createNativeStackNavigator();

function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#f4511e" },
                headerTintColor: "#fff",
                headerTitleStyle: { fontWeight: "bold" },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Home Screen" }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "My Profile" }} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Details" }} />
        </Stack.Navigator>
    );
}

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let icon;
                    if (route.name === "Home") {
                        icon = focused ? "🏠" : "🏡";
                    } else {
                        icon = focused ? "👤" : "👥";
                    }
                    return <Text>{icon}</Text>;
                },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

// Drawer Navigator
const Drawer = createDrawerNavigator();

function AppDrawer() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    );
}

// 组合使用
function App() {
    return (
        <NavigationContainer>
            <AppStack />
        </NavigationContainer>
    );
}
```

### 9. 导航传参与跳转

```tsx
// 屏幕组件中获取参数
function DetailsScreen({ route, navigation }) {
    const { itemId, otherParam } = route.params;

    return (
        <View>
            <Text>Item ID: {itemId}</Text>
            <Text>Other: {otherParam}</Text>
        </View>
    );
}

// 跳转时传递参数
function HomeScreen({ navigation }) {
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("Details", {
                    itemId: 42,
                    otherParam: "hello",
                });
            }}
        >
            <Text>Go to Details</Text>
        </TouchableOpacity>
    );
}

// 传递参数到 Tab
navigation.navigate("Profile", {
    userId: "123",
});

// 返回上一页
navigation.goBack();

// 返回到指定页面
navigation.popToTop();

// 使用 navigate 而非 push
navigation.navigate("Profile");
```

## 状态管理

### 10. 状态管理方案对比

```tsx
// 1. useState + useContext
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}

// 2. Zustand（轻量级状态管理）
import { create } from "zustand";

interface CounterState {
    count: number;
    increment: () => void;
    decrement: () => void;
}

const useStore = create<CounterState>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// 使用
function Counter() {
    const { count, increment, decrement } = useStore();
    return (
        <View>
            <Text>{count}</Text>
            <Button onPress={increment}>+</Button>
            <Button onPress={decrement}>-</Button>
        </View>
    );
}

// 3. Redux Toolkit
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

const counterSlice = createSlice({
    name: "counter",
    initialState: { value: 0 },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
});

const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
    },
});

function ReduxCounter() {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <View>
            <Text>{count}</Text>
            <Button onPress={() => dispatch(increment())}>+</Button>
            <Button onPress={() => dispatch(decrement())}>-</Button>
        </View>
    );
}

function App() {
    return (
        <Provider store={store}>
            <ReduxCounter />
        </Provider>
    );
}
```

## 原生模块

### 11. Native Modules 使用

```typescript
// iOS - Swift Native Module
import Foundation
import React

@objc(MyNativeModule)
class MyNativeModule: NSObject {

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc
  func showAlert(_ title: String, message: String) {
    DispatchQueue.main.async {
      let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
      alert.addAction(UIAlertAction(title: "OK", style: .default))
      UIApplication.shared.keyWindow?.rootViewController?.present(alert, animated: true)
    }
  }

  @objc
  func getDeviceInfo(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    let info: [String: Any] = [
      "systemName": UIDevice.current.systemName,
      "systemVersion": UIDevice.current.systemVersion,
      "model": UIDevice.current.model
    ]
    resolve(info)
  }
}

// 导出 Native Module
@objc(MyNativeModuleBridge)
object MyNativeModuleBridge {
  @objc
  static func moduleName() -> String {
    return "MyNativeModule"
  }

  @objc
  static func module() -> Any! {
    return MyNativeModule()
  }
}
```

```tsx
// React Native 端使用
import { NativeModules, Platform } from "react-native";

const { MyNativeModule } = NativeModules;

function useNativeModule() {
    const showAlert = async (title: string, message: string) => {
        if (Platform.OS === "ios") {
            MyNativeModule?.showAlert(title, message);
        }
    };

    const getDeviceInfo = async () => {
        try {
            const info = await MyNativeModule?.getDeviceInfo();
            return info;
        } catch (error) {
            console.error("Error getting device info:", error);
        }
    };

    return { showAlert, getDeviceInfo };
}
```

### 12. 自定义 Hooks

```tsx
import { useState, useEffect, useCallback, useRef } from "react";

// 网络状态监听
import { useNetInfo } from "@react-native-community/netinfo";

function useNetwork() {
    const netInfo = useNetInfo();

    return {
        isConnected: netInfo.isConnected,
        isInternetReachable: netInfo.isInternetReachable,
        type: netInfo.type,
        details: netInfo.details,
    };
}

// 异步数据获取 Hook
function useAsyncData<T>(fetchFn: () => Promise<T>, dependencies: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

// 动画 Hook
function useAnimatedValue(initialValue: number) {
    const animatedValue = useRef(new Animated.Value(initialValue)).current;

    const animate = useCallback(
        (toValue: number, duration: number = 300) => {
            return new Promise((resolve) => {
                Animated.timing(animatedValue, {
                    toValue,
                    duration,
                    useNativeDriver: true,
                }).start(resolve);
            });
        },
        [animatedValue],
    );

    return { value: animatedValue, animate };
}

// 防抖 Hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
```

## 性能优化

### 13. 性能优化技巧

```tsx
import { memo, useMemo, useCallback } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';

// 1. 使用 memo 避免不必要的重渲染
const MyComponent = memo(function MyComponent({ data, onPress }) {
  return (
    <View>
      <Text>{data.name}</Text>
      <Button onPress={onPress} />
    </View>
  );
});

// 2. useMemo 缓存计算结果
function ExpensiveComponent({ list, filter }) {
  const filteredList = useMemo(() => {
    return list.filter(item => item.name.includes(filter));
  }, [list, filter]);

  return <FlatList data={filteredList} renderItem={...} />;
}

// 3. useCallback 缓存回调函数
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handlePress = useCallback(() => {
    console.log('Pressed');
  }, []);

  return <ChildComponent onPress={handlePress} count={count} />;
}

// 4. FlatList 优化
function OptimizedFlatList({ data }) {
  const renderItem = useCallback(({ item }) => (
    <ListItem item={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
      })}
    />
  );
}

// 5. 使用 Hermes 引擎
// android/app/build.gradle
// project.ext.react = [
//   enableHermes: true
// ]
```

## 面试精选问题

### 问题一：React Native 的工作原理是什么？

**答案要点**：

**核心原理：**

1. **JS 线程**：运行 JavaScript 代码，处理业务逻辑
2. **Native 线程**：执行原生代码，处理 UI 渲染
3. **Bridge/JSI**：连接 JS 和 Native 的通信桥梁

**通信流程：**

```
用户交互 → Native 事件 → Bridge → JS 回调
JS 状态更新 → Bridge → Native UI 更新
```

**React Native 如何渲染 UI：**

1. JS 端使用 React 描述 UI（类似 Virtual DOM）
2. React Native 将组件树转换为原生组件
3. Yoga 引擎计算布局
4. 原生平台执行渲染

### 问题二：React Native 的生命周期和 React 有什么不同？

**答案要点**：

**React Native 组件生命周期：**

```tsx
// 类组件
class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    componentDidMount() {
        // 组件挂载后调用
        console.log("Component mounted");
    }

    componentDidUpdate(prevProps, prevState) {
        // 组件更新后调用
        if (prevState.count !== this.state.count) {
            console.log("State updated");
        }
    }

    componentWillUnmount() {
        // 组件卸载前调用
        console.log("Component will unmount");
    }

    render() {
        return <Text>{this.state.count}</Text>;
    }
}
```

**Hook 替代方案：**

```tsx
function MyComponent() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Component mounted");
        return () => console.log("Component will unmount");
    }, []);

    useEffect(() => {
        console.log("Component updated");
    }, [count]);

    return <Text>{count}</Text>;
}
```

### 问题三：如何处理 React Native 的适配问题？

**答案要点**：

**1. 尺寸适配**

```tsx
import { PixelRatio, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// 使用 PixelRatio 处理字体
const fontSize = PixelRatio.getFontSize();
const scale = PixelRatio.get();

// 使用 Dimensions 处理宽高
const cardWidth = (width - 48) / 2;

// 使用 Platform 处理平台差异
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: Platform.OS === "ios" ? 20 : 16,
    },
});
```

**2. 安全区域适配**

```tsx
import { SafeAreaView } from "react-native";

function Screen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Content />
        </SafeAreaView>
    );
}
```

**3. 横竖屏适配**

```tsx
import { useDimensionsChange } from "react-native-dimensions";

function App() {
    useDimensionsChange(({ window }) => {
        const isLandscape = window.width > window.height;
        // 处理横竖屏切换
    });

    return <Content />;
}
```

### 问题四：React Native 的热更新是如何实现的？

**答案要点**：

**1. CodePush（微软）**

```bash
npm install @react-native-community/code-push
```

```tsx
import codePush from "react-native-code-push";

function App() {
    useEffect(() => {
        codePush.sync({
            updateDialog: {
                title: "Update Available",
                message: "A new version is available.",
            },
            installMode: codePush.InstallMode.IMMEDIATE,
        });
    }, []);

    return <Content />;
}
```

**2. React Native CLI 热更新**

```bash
# 打包 JS Bundle
react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle
```

**3. 自定义热更新方案**

- 将 JS Bundle 放到 CDN
- 应用启动时检查更新
- 下载并替换本地 Bundle
- 下次启动时使用新 Bundle

### 问题五：React Native 和 Flutter 有什么区别？

**答案要点**：

| 特性     | React Native          | Flutter                |
| -------- | --------------------- | ---------------------- |
| 语言     | JavaScript/TypeScript | Dart                   |
| 渲染     | 原生组件              | Skia 自绘              |
| 性能     | 依赖原生渲染          | 自带渲染引擎，性能更好 |
| 生态     | 基于 React，生态丰富  | 相对年轻               |
| 包大小   | 较小                  | 较大（包含渲染引擎）   |
| 学习曲线 | 低（基于 React）      | 中（Dart 语言）        |
| 开发体验 | Hot Reload 成熟       | Hot Reload 更快        |
| 原生能力 | 需要原生模块          | 同样需要               |

### 问题六：如何优化 React Native 的列表性能？

**答案要点**：

**1. 使用 FlatList 而非 ScrollView**

```tsx
// 错误：一次性渲染所有项
<ScrollView>
  {items.map(item => <ListItem key={item.id} data={item} />)}
</ScrollView>

// 正确：虚拟列表，只渲染可见项
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem data={item} />}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index
  })}
/>
```

**2. 减少渲染项复杂度**

- 使用 `memo` 包装列表项组件
- 避免在 `renderItem` 中创建新函数
- 使用 `useCallback` 缓存回调

**3. 使用优化属性**

```tsx
<FlatList
    removeClippedSubviews={true} // 卸载屏幕外的视图
    maxToRenderPerBatch={10} // 每批最多渲染项数
    windowSize={10} // 窗口大小
    initialNumToRender={10} // 初始渲染项数
    getItemLayout={getItemLayout} // 跳过动态测量
/>
```

### 问题七：React Native 的新架构（Fabric/TurboModules）有什么优势？

**答案要点**：

**1. JSI（JavaScript Interface）**

- 替代 Bridge，直接调用 C++ 对象
- 同步调用，无需序列化/反序列化
- 支持共享内存

**2. Fabric（新的渲染系统）**

- 同步渲染，提高交互响应速度
- 更好的动画支持
- 支持 React Suspense

**3. TurboModules（新的原生模块系统）**

- 懒加载，按需初始化
- 更好的类型安全
- 支持并发

**迁移注意事项：**

```tsx
// 旧架构
import { NativeModules } from "react-native";
const { MyModule } = NativeModules;

// 新架构
import NativeMyModule from "MyModuleNativeComponent";

// 使用 TurboModules
import { TurboModuleRegistry } from "react-native";
const MyModule = TurboModuleRegistry.getEnforcing<Spec>("MyModule");
```
