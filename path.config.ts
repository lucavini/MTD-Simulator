import moduleAlias from 'module-alias';
import 'dotenv/config';

moduleAlias.addAliases({
  '@Root': __dirname,
  '@Lib': `${__dirname}/src/Lib`,
  '@Modules': `${__dirname}/src/Server/modules`,
});
