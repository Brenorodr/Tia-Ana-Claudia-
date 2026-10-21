# Tia Ana Cláudia — reconstrução estática

Versão reconstruída a partir do HTML público do blog original.

## Arquivos

- `index.html` — estrutura e conteúdo visual.
- `style.css` — layout, responsividade, tipografia, estados e menu mobile.
- `script.js` — busca, filtros, ordenação, menu mobile, catálogo, jogos e perfil.
- `data.js` — acervo extraído do blog original.

## Correções

- Removidas dependências do Blogger.
- Menu mobile funcional.
- Busca e filtros mais robustos.
- URLs antigas/inválidas não quebram o JavaScript.
- Títulos dos links são inseridos com segurança.
- Post original preservado, sem elementos administrativos do Blogger.
- Foto do perfil original usada quando disponível.
- Links externos usam `noopener noreferrer`.
- Layout responsivo para desktop, tablet e celular.

Os links continuam sendo os endereços registrados no blog antigo. A próxima etapa recomendada é auditar quais ainda estão ativos.


## Auditoria dos links (21/10/2026)

- Removidas do catálogo as entradas com erro HTTP definitivo, redirecionamento para página inicial sem o conteúdo esperado e jogos dependentes de Flash.
- Links classificados como fora do ar por falha de conexão/timeout e links com erro 403 foram mantidos para revisão posterior, pois o relatório não confirma que sejam permanentemente inválidos.
- Consulte `RELATORIO_LIMPEZA.txt` para os totais.
