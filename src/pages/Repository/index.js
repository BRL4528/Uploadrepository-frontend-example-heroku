/* eslint-disable react/button-has-type */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, Bot } from './styles';

export default class Repository extends Component {
  // eslint-disable-next-line react/sort-comp
  static propsTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.sstring,
      }),
    }).isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    repository: {},
    issues: [],
    loading: true,
    pagina: 0,
  };

  async componentDidMount(tag) {
    // eslint-disable-next-line react/prop-types
    const { match } = this.props;

    // eslint-disable-next-line react/prop-types
    const repoName = decodeURIComponent(match.params.repository);

    const { pagina } = this.state;
    // VERIFICA AQ QUAL É A CONDIÇÃO DO ISSUES QUE USUARIO ESTA PEDINDO
    if (tag == undefined) {
      tag = 'all';
    }
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: tag,
          page: pagina,
        },
      }),
    ]);
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleSelectChange = e => {
    this.componentDidMount(e.target.value);
  };

  handleSelectPage = e => {
    // eslint-disable-next-line radix
    let numero = parseInt(e.target.value);
    numero += 1;
    this.atualiza(numero);

    this.componentDidMount();
  };

  atualiza(x) {
    this.setState({ pagina: x });
  }

  render() {
    const { repository, issues, loading, pagina } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos Repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Bot id="selc" onChange={this.handleSelectChange}>
          <option value="all">Todos</option>
          <option value="open">Abertos</option>
          <option value="closed">Fechados</option>
        </Bot>
        <h1>Pagina {pagina}</h1>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issues.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <button value={pagina} onClick={this.handleSelectPage}>
          Proximo
        </button>
      </Container>
    );
  }
}
