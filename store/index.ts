
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { useDispatch } from "react-redux";
import authStateReducer from "../store/modules/auth.store";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
const persistConfig = {key: "root",storage: AsyncStorage};
const rootReducer = combineReducers({authState: authStateReducer,}); //Combina os reducers em um único reducer raiz.
const persistedReducer = persistReducer(persistConfig, rootReducer); //Cria um reducer persistido.
// PersistConfig: Configuração do persist.
// RootReducer: Reducer raiz da aplicação.
const store = configureStore({
  reducer: persistedReducer, //Adiciona o reducer persistido à store.
  middleware: (getDefaultMiddleware) => //Configuração de middlewares. O middleware aqui funciona como um wrapper para o middleware padrão.
  // O middleware padrão é obtido através da função getDefaultMiddleware. Ele é responsável por lidar com ações assíncronas e outras funcionalidades.
	getDefaultMiddleware({
	  immutableCheck: false, //Desativado para melhorar a performance.
	  serializableCheck: { //Personalizado para ignorar ações específicas do redux-persist.
		ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
	  },
	}),
});
const persistor = persistStore(store); // Cria um persistor para sincronizar a store com o armazenamento persistente.
export type RootState = ReturnType<typeof store.getState>; //RootState: Tipo que representa o estado raiz da store.
export type AppDispatch = typeof store.dispatch; //AppDispatch: Tipo que representa o despachante da store.
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Hook para acessar o dispatch tipado.
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>; //Tipo para ações assíncronas (thunks) no Redux.
export type AppThunkApiConfig = ThunkAction<void, RootState, null, Action<string>>;//Tipo similar ao AppThunk, mas com um terceiro parâmetro null.
//O parâmetro null é utilizado para a configuração de middlewares. 
export { store, persistor };

//Qual a diferença entre middleware e thunk no Redux?
//O middleware é um mecanismo que permite interceptar ações antes que elas cheguem aos reducers.
//Ele é utilizado para adicionar funcionalidades extras ao Redux, como log, chamadas assíncronas, etc.
//O thunk é um tipo de middleware que permite a criação de ações assíncronas no Redux.
//Ele é uma função que retorna outra função, que recebe os argumentos dispatch e getState.