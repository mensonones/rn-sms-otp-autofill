# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 📚 Documentação
- Adicionada documentação completa da API
- Criados exemplos avançados de uso
- Guia de integração com diferentes frameworks
- Melhorias no README principal

## [0.1.0] - 2025-01-13

### ✨ Adicionado
- Implementação inicial do módulo React Native para autofill de OTP
- Suporte para TurboModule (Nova Arquitetura do React Native)
- Detecção automática de códigos OTP em mensagens SMS (Android)
- Verificação automática de permissões RECEIVE_SMS
- Hook `useOtpAutofill` para uso simplificado
- Hook `useSmsPermission` para gerenciamento de permissões
- Componente `OtpInput` de exemplo
- Validação de códigos OTP (4-6 dígitos)
- Cleanup automático de listeners
- Emissão de eventos nativos (`onOtpAutofill`, `onOtpAutofillError`)

### 🔧 Técnico
- Implementação em Kotlin para o módulo Android
- Interface TurboModule com TypeScript
- BroadcastReceiver para interceptar mensagens SMS
- Filtragem inteligente de códigos OTP válidos
- Prevenção de vazamentos de memória

### 📱 Compatibilidade
- Android API Level 16+ (Android 4.1+)
- React Native 0.68+
- Nova Arquitetura do React Native (TurboModules)
- TypeScript incluído

### 🛡️ Segurança
- Verificação de permissões em runtime
- Validação de formato de OTP
- Proteção contra códigos inválidos
- Cleanup automático de recursos

### 📚 Documentação
- README completo com exemplos
- Documentação da API TypeScript
- Guia de instalação e configuração
- Exemplos de hooks personalizados
- Integração com Firebase Auth
- Troubleshooting e FAQ

### 🧪 Testes
- Configuração para testes unitários
- Mocks para ambiente de desenvolvimento
- Estrutura para testes E2E

### 🎨 Exemplo
- App de exemplo funcional
- Integração com Firebase Authentication
- Interface moderna e responsiva
- Demonstração de diferentes casos de uso
- Componentes reutilizáveis

---

## 🔄 Versionamento

Este projeto segue o [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (0.X.0): Funcionalidades adicionadas de forma compatível
- **PATCH** (0.0.X): Correções de bugs compatíveis

## 📝 Tipos de Mudanças

- **✨ Adicionado** - Para novas funcionalidades
- **🔄 Modificado** - Para mudanças em funcionalidades existentes
- **❌ Depreciado** - Para funcionalidades que serão removidas
- **🗑️ Removido** - Para funcionalidades removidas
- **🐛 Corrigido** - Para correções de bugs
- **🔒 Segurança** - Para vulnerabilidades

## 🚧 Planejamento Futuro

### v0.2.0 (Planejado)
- [ ] Suporte para diferentes formatos de SMS
- [ ] Configuração de timeout personalizável
- [ ] Melhor tratamento de erros
- [ ] Cache de permissões
- [ ] Logs de debug configuráveis

### v0.3.0 (Planejado)
- [ ] Suporte para múltiplos códigos OTP simultâneos
- [ ] Detecção de códigos alfa-numéricos
- [ ] Configuração de filtros personalizados
- [ ] Métricas de performance

### v1.0.0 (Planejado)
- [ ] API estável e finalizada
- [ ] Documentação completa
- [ ] Testes abrangentes
- [ ] Performance otimizada
- [ ] Suporte para Expo (Config Plugin)

## 📞 Suporte

Para relatar bugs, solicitar funcionalidades ou obter ajuda:

- 🐛 [Issues](https://github.com/mensonones/rn-sms-otp-autofill/issues)
- 💬 [Discussions](https://github.com/mensonones/rn-sms-otp-autofill/discussions)
- 📖 [Documentação](../README.md)

## 🙏 Contribuições

Contribuições são sempre bem-vindas! Veja nosso [guia de contribuição](../CONTRIBUTING.md) para mais detalhes.
