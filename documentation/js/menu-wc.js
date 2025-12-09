'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">comunes-angular documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfiguracionComponent.html" data-type="entity-link" >ConfiguracionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent-1.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetalleGastoComponent.html" data-type="entity-link" >DetalleGastoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EstadisticasGastosComponent.html" data-type="entity-link" >EstadisticasGastosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GestionarGastosComponent.html" data-type="entity-link" >GestionarGastosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GestionarResidentesComponent.html" data-type="entity-link" >GestionarResidentesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HistorialPagosComponent.html" data-type="entity-link" >HistorialPagosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InfoFinancieraComponent.html" data-type="entity-link" >InfoFinancieraComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListaCasasComponent.html" data-type="entity-link" >ListaCasasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MisGastosComponent.html" data-type="entity-link" >MisGastosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PerfilComponent.html" data-type="entity-link" >PerfilComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RealizarPagoComponent.html" data-type="entity-link" >RealizarPagoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RecuperarComponent.html" data-type="entity-link" >RecuperarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegistrarPagosComponent.html" data-type="entity-link" >RegistrarPagosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegistroComponent.html" data-type="entity-link" >RegistroComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReportesComponent.html" data-type="entity-link" >ReportesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SolicitudesComponent.html" data-type="entity-link" >SolicitudesComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CustomValidators.html" data-type="entity-link" >CustomValidators</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CarritoService.html" data-type="entity-link" >CarritoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CasasService.html" data-type="entity-link" >CasasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConceptosGastosService.html" data-type="entity-link" >ConceptosGastosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PagosHistoricosService.html" data-type="entity-link" >PagosHistoricosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TasasInteresService.html" data-type="entity-link" >TasasInteresService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TipoCambioService.html" data-type="entity-link" >TipoCambioService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Casa.html" data-type="entity-link" >Casa</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConceptoGasto.html" data-type="entity-link" >ConceptoGasto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfigGeneral.html" data-type="entity-link" >ConfigGeneral</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Configuracion.html" data-type="entity-link" >Configuracion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cuota.html" data-type="entity-link" >Cuota</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DetalleGasto.html" data-type="entity-link" >DetalleGasto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Estadisticas.html" data-type="entity-link" >Estadisticas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Estadisticas-1.html" data-type="entity-link" >Estadisticas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Estadisticas-2.html" data-type="entity-link" >Estadisticas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Gasto.html" data-type="entity-link" >Gasto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Gasto-1.html" data-type="entity-link" >Gasto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ItemCarrito.html" data-type="entity-link" >ItemCarrito</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuItem.html" data-type="entity-link" >MenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Pago.html" data-type="entity-link" >Pago</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Pago-1.html" data-type="entity-link" >Pago</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Pago-2.html" data-type="entity-link" >Pago</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PagoForm.html" data-type="entity-link" >PagoForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PagoHistorico.html" data-type="entity-link" >PagoHistorico</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Passwords.html" data-type="entity-link" >Passwords</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Requisitos.html" data-type="entity-link" >Requisitos</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Residente.html" data-type="entity-link" >Residente</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Residente-1.html" data-type="entity-link" >Residente</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Resumen.html" data-type="entity-link" >Resumen</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Solicitud.html" data-type="entity-link" >Solicitud</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Solicitud-1.html" data-type="entity-link" >Solicitud</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TasaInteres.html" data-type="entity-link" >TasaInteres</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoCambio.html" data-type="entity-link" >TipoCambio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoCambioSimple.html" data-type="entity-link" >TipoCambioSimple</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Usuario.html" data-type="entity-link" >Usuario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Usuario-1.html" data-type="entity-link" >Usuario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Usuario-2.html" data-type="entity-link" >Usuario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Usuario-3.html" data-type="entity-link" >Usuario</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});